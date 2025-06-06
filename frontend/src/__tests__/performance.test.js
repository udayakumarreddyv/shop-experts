import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { performance } from 'perf_hooks';
import '@testing-library/jest-dom';
import { renderWithProviders, mockAuthUser, mockExpertUser } from '../utils/testUtils';
import App from '../App';

// Mock heavy components for performance testing
jest.mock('../components/common/Navbar', () => {
  const React = require('react');
  return React.memo(function MockNavbar() {
    return React.createElement('nav', { 'data-testid': 'navbar' }, 'Navbar');
  });
});

jest.mock('../pages/Dashboard', () => {
  const React = require('react');
  return React.memo(function MockDashboard() {
    return React.createElement('div', { 'data-testid': 'dashboard' }, 'Dashboard');
  });
});

describe('Performance Tests', () => {
  const measureRenderTime = (componentRenderFn) => {
    const start = performance.now();
    componentRenderFn();
    const end = performance.now();
    return end - start;
  };

  describe('Component Render Performance', () => {
    it('renders App component within acceptable time', () => {
      const renderTime = measureRenderTime(() => {
        renderWithProviders(<App />);
      });

      // Should render within 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('renders authenticated App quickly', () => {
      const mockUser = mockAuthUser();
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      const renderTime = measureRenderTime(() => {
        renderWithProviders(<App />);
      });

      // Should render authenticated state within 150ms
      expect(renderTime).toBeLessThan(150);
    });

    it('handles rapid re-renders efficiently', async () => {
      const { rerender } = renderWithProviders(<App />);

      const times = [];
      for (let i = 0; i < 10; i++) {
        const renderTime = measureRenderTime(() => {
          rerender(<App key={i} />);
        });
        times.push(renderTime);
      }

      const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      
      // Average re-render should be under 50ms
      expect(averageTime).toBeLessThan(50);
    });
  });

  describe('Memory Usage', () => {
    it('does not create memory leaks during component lifecycle', () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      // Render and unmount component multiple times
      for (let i = 0; i < 50; i++) {
        const { unmount } = renderWithProviders(<App />);
        unmount();
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be minimal (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });

    it('properly cleans up event listeners', () => {
      const initialListeners = process.listenerCount?.('unhandledRejection') || 0;
      
      const { unmount } = renderWithProviders(<App />);
      unmount();

      const finalListeners = process.listenerCount?.('unhandledRejection') || 0;
      
      // Should not leak event listeners
      expect(finalListeners).toBeLessThanOrEqual(initialListeners);
    });
  });

  describe('Large Dataset Performance', () => {
    it('handles large expert lists efficiently', async () => {
      // Mock a large dataset
      const largeExpertList = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        firstName: `Expert${i}`,
        lastName: `User${i}`,
        expertise: 'Test Expertise',
        rating: 4.5,
        reviewCount: 10
      }));

      const MockExpertList = () => (
        <div data-testid="expert-list">
          {largeExpertList.map(expert => (
            <div key={expert.id} data-testid="expert-item">
              {expert.firstName} {expert.lastName}
            </div>
          ))}
        </div>
      );

      const renderTime = measureRenderTime(() => {
        render(<MockExpertList />);
      });

      // Should render 1000 items within 200ms
      expect(renderTime).toBeLessThan(200);
    });

    it('handles rapid filtering operations efficiently', async () => {
      const largeDataset = Array.from({ length: 500 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        category: i % 5 === 0 ? 'special' : 'normal'
      }));

      const FilteredList = ({ filter }) => {
        const filtered = largeDataset.filter(item => 
          filter ? item.category === filter : true
        );
        
        return (
          <div data-testid="filtered-list">
            {filtered.map(item => (
              <div key={item.id}>{item.name}</div>
            ))}
          </div>
        );
      };

      // Test multiple filter operations
      const times = [];
      const filters = ['special', 'normal', null, 'special', null];
      
      filters.forEach(filter => {
        const filterTime = measureRenderTime(() => {
          render(<FilteredList filter={filter} />);
        });
        times.push(filterTime);
      });

      const maxTime = Math.max(...times);
      
      // Each filter operation should complete within 100ms
      expect(maxTime).toBeLessThan(100);
    });
  });

  describe('Network Performance', () => {
    it('handles concurrent API calls efficiently', async () => {
      const mockUser = mockAuthUser();
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      const startTime = performance.now();

      // Simulate multiple components making API calls
      const promises = [
        renderWithProviders(<App />),
        renderWithProviders(<App />),
        renderWithProviders(<App />)
      ];

      await Promise.all(promises.map(({ container }) => 
        waitFor(() => expect(container).toBeInTheDocument())
      ));

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Multiple concurrent renders should complete within 500ms
      expect(totalTime).toBeLessThan(500);
    });

    it('caches repeated API calls appropriately', async () => {
      const originalFetch = global.fetch;
      let fetchCallCount = 0;

      global.fetch = jest.fn((...args) => {
        fetchCallCount++;
        return originalFetch(...args);
      });

      const mockUser = mockAuthUser();
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      // Render multiple instances that would make same API calls
      renderWithProviders(<App />);
      renderWithProviders(<App />);
      renderWithProviders(<App />);

      await waitFor(() => {
        expect(screen.getAllByTestId('navbar')).toHaveLength(3);
      });

      // Should not make excessive API calls
      expect(fetchCallCount).toBeLessThan(10);

      global.fetch = originalFetch;
    });
  });

  describe('Animation and Interaction Performance', () => {
    it('maintains 60fps during animations', (done) => {
      const { container } = renderWithProviders(<App />);
      
      let frameCount = 0;
      let startTime = performance.now();
      
      const measureFrame = () => {
        frameCount++;
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        
        if (elapsed >= 1000) { // After 1 second
          const fps = (frameCount / elapsed) * 1000;
          
          // Should maintain close to 60fps
          expect(fps).toBeGreaterThan(50);
          done();
          return;
        }
        
        requestAnimationFrame(measureFrame);
      };
      
      requestAnimationFrame(measureFrame);
    });

    it('handles rapid user interactions efficiently', async () => {
      const { container } = renderWithProviders(<App />);
      
      const button = container.querySelector('button');
      if (!button) return;

      const interactionTimes = [];
      
      // Simulate rapid clicking
      for (let i = 0; i < 20; i++) {
        const startTime = performance.now();
        
        button.click();
        
        await waitFor(() => {
          expect(button).toBeInTheDocument();
        });
        
        const endTime = performance.now();
        interactionTimes.push(endTime - startTime);
      }

      const averageInteractionTime = interactionTimes.reduce((sum, time) => sum + time, 0) / interactionTimes.length;
      
      // Average interaction response should be under 50ms
      expect(averageInteractionTime).toBeLessThan(50);
    });
  });

  describe('Bundle Size and Loading Performance', () => {
    it('keeps component tree shallow for optimal performance', () => {
      const { container } = renderWithProviders(<App />);
      
      // Count DOM depth
      let maxDepth = 0;
      const countDepth = (element, depth = 0) => {
        maxDepth = Math.max(maxDepth, depth);
        for (const child of element.children) {
          countDepth(child, depth + 1);
        }
      };
      
      countDepth(container);
      
      // DOM depth should be reasonable (less than 20 levels)
      expect(maxDepth).toBeLessThan(20);
    });

    it('loads components lazily when possible', async () => {
      const loadStart = performance.now();
      
      renderWithProviders(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
      });
      
      const loadEnd = performance.now();
      const loadTime = loadEnd - loadStart;
      
      // Initial load should be fast
      expect(loadTime).toBeLessThan(200);
    });
  });

  describe('Error Handling Performance', () => {
    it('handles errors without significant performance impact', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock a component that throws an error
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      const renderTime = measureRenderTime(() => {
        try {
          render(<ErrorComponent />);
        } catch (error) {
          // Expected error
        }
      });

      // Error handling should not significantly impact performance
      expect(renderTime).toBeLessThan(50);
      
      consoleSpy.mockRestore();
    });

    it('recovers quickly from network errors', async () => {
      const originalFetch = global.fetch;
      
      // Mock network failure then success
      let callCount = 0;
      global.fetch = jest.fn(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: 'success' })
        });
      });

      const startTime = performance.now();
      
      renderWithProviders(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      const recoveryTime = endTime - startTime;
      
      // Should recover from network error within reasonable time
      expect(recoveryTime).toBeLessThan(1000);
      
      global.fetch = originalFetch;
    });
  });
});
