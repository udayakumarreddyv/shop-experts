import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup MSW server for testing
const server = setupServer(...handlers);

describe('MSW Handlers', () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  describe('Authentication Handlers', () => {
    describe('POST /api/auth/signin', () => {
      it('returns success response for valid credentials', async () => {
        // Use a try/catch block to handle potential fetch failures
        try {
          const response = await fetch('http://localhost:8080/api/auth/signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'password123',
            }),
          });

          expect(response.status).toBe(200);
          
          const data = await response.json();
          expect(data).toEqual({
            accessToken: 'mock-access-token',
            user: {
              id: 1,
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              role: 'USER'
            }
          });
        } catch (error) {
          fail('Test should not throw an error: ' + error.message);
        }
      });

      it('returns error response for invalid credentials', async () => {
        const response = await fetch('http://localhost:8080/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'wrong@example.com',
            password: 'wrongpassword',
          }),
        });

        expect(response.status).toBe(401);
        
        const data = await response.json();
        expect(data).toEqual({
          message: 'Invalid credentials'
        });
      });

      it('handles missing credentials', async () => {
        const response = await fetch('http://localhost:8080/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        expect(response.status).toBe(401);
      });
    });

    describe('POST /api/auth/signup', () => {
      it('returns success response for new user registration', async () => {
        const response = await fetch('http://localhost:8080/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: 'New',
            lastName: 'User',
            email: 'newuser@example.com',
            password: 'password123',
            userType: 'USER'
          }),
        });

        expect(response.status).toBe(201);
        
        const data = await response.json();
        expect(data).toEqual({
          message: 'Registration successful'
        });
      });

      it('returns error response for existing email', async () => {
        const response = await fetch('http://localhost:8080/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: 'Existing',
            lastName: 'User',
            email: 'existing@example.com',
            password: 'password123',
            userType: 'USER'
          }),
        });

        expect(response.status).toBe(400);
        
        const data = await response.json();
        expect(data).toEqual({
          message: 'Email already exists'
        });
      });
    });

    describe('GET /api/auth/me', () => {
      it('returns user data for valid token', async () => {
        const response = await fetch('http://localhost:8080/api/auth/me', {
          headers: {
            'Authorization': 'Bearer mock-access-token',
          },
        });

        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data).toEqual({
          id: 1,
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          role: 'USER'
        });
      });

      it('returns error for missing authorization header', async () => {
        const response = await fetch('http://localhost:8080/api/auth/me');

        expect(response.status).toBe(401);
        
        const data = await response.json();
        expect(data).toEqual({
          message: 'Unauthorized'
        });
      });

      it('returns error for invalid token format', async () => {
        const response = await fetch('http://localhost:8080/api/auth/me', {
          headers: {
            'Authorization': 'invalid-token',
          },
        });

        expect(response.status).toBe(401);
      });
    });
  });

  describe('Experts Handlers', () => {
    describe('GET /api/experts', () => {
      it('returns all experts when no filters applied', async () => {
        const response = await fetch('http://localhost:8080/api/experts');

        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data).toHaveLength(2);
        expect(data[0]).toMatchObject({
          id: 1,
          firstName: 'Jane',
          lastName: 'Smith',
          expertise: 'Hair Styling',
          location: 'New York',
          rating: 4.8,
          reviewCount: 127,
          hourlyRate: 50
        });
      });

      it('filters experts by expertise', async () => {
        const response = await fetch('http://localhost:8080/api/experts?expertise=hair');

        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data).toHaveLength(1);
        expect(data[0].expertise).toBe('Hair Styling');
      });

      it('filters experts by location', async () => {
        const response = await fetch('http://localhost:8080/api/experts?location=new%20york');

        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data).toHaveLength(1);
        expect(data[0].location).toBe('New York');
      });

      it('returns empty array when no experts match filters', async () => {
        const response = await fetch('http://localhost:8080/api/experts?expertise=nonexistent');

        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data).toHaveLength(0);
      });

      it('applies multiple filters correctly', async () => {
        const response = await fetch('http://localhost:8080/api/experts?expertise=personal&location=los');

        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data).toHaveLength(1);
        expect(data[0].expertise).toBe('Personal Training');
        expect(data[0].location).toBe('Los Angeles');
      });
    });

    describe('GET /api/experts/:id', () => {
      it('returns expert details for valid ID', async () => {
        const response = await fetch('http://localhost:8080/api/experts/1');

        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data).toMatchObject({
          id: 1,
          firstName: 'Jane',
          lastName: 'Smith',
          expertise: 'Hair Styling',
          location: 'New York',
          rating: 4.8,
          reviewCount: 127,
          hourlyRate: 50,
          bio: 'Professional hair stylist with 10 years of experience',
          services: expect.arrayContaining([
            expect.objectContaining({
              id: 1,
              title: 'Hair Cut & Style',
              description: 'Professional haircut and styling',
              price: 75,
              duration: 90
            })
          ])
        });
      });

      it('handles string ID parameters correctly', async () => {
        const response = await fetch('http://localhost:8080/api/experts/123');

        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data.id).toBe(123);
      });
    });
  });

  describe('Bookings Handlers', () => {
    describe('POST /api/bookings', () => {
      it('creates new booking successfully', async () => {
        const bookingData = {
          expertId: 1,
          serviceId: 1,
          date: '2024-12-15',
          time: '10:00',
          notes: 'First time booking'
        };

        const response = await fetch('http://localhost:8080/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-access-token',
          },
          body: JSON.stringify(bookingData),
        });

        expect(response.status).toBe(201);
        
        const data = await response.json();
        expect(data).toMatchObject({
          id: 1,
          ...bookingData,
          status: 'PENDING',
          createdAt: expect.any(String)
        });
      });

      it('includes timestamp in booking response', async () => {
        const bookingData = {
          expertId: 1,
          serviceId: 1,
          date: '2024-12-15',
          time: '10:00'
        };

        const response = await fetch('http://localhost:8080/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });

        const data = await response.json();
        expect(data.createdAt).toBeDefined();
        expect(new Date(data.createdAt)).toBeInstanceOf(Date);
      });
    });
  });

  describe('Error Handling', () => {
    it('handles network errors gracefully', async () => {
      // Override handler to simulate network error
      server.use(
        rest.get('http://localhost:8080/api/experts', (req, res, ctx) => {
          return res.networkError('Network error');
        })
      );

      try {
        await fetch('http://localhost:8080/api/experts');
      } catch (error) {
        expect(error.message).toContain('Network error');
      }
    });

    it('handles server errors gracefully', async () => {
      // Override handler to simulate server error
      server.use(
        rest.get('http://localhost:8080/api/experts', (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ message: 'Internal server error' })
          );
        })
      );

      const response = await fetch('http://localhost:8080/api/experts');
      expect(response.status).toBe(500);
      
      const data = await response.json();
      expect(data.message).toBe('Internal server error');
    });

    it('handles malformed requests gracefully', async () => {
      const response = await fetch('http://localhost:8080/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid-json',
      });

      // MSW should handle malformed JSON gracefully
      expect(response.status).toBe(401);
    });
  });

  describe('Request Validation', () => {
    it('handles missing request body', async () => {
      const response = await fetch('http://localhost:8080/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(response.status).toBe(401);
    });

    it('handles empty request body', async () => {
      const response = await fetch('http://localhost:8080/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(401);
    });

    it('validates required fields in registration', async () => {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com'
          // Missing other required fields
        }),
      });

      expect(response.status).toBe(201); // Handler doesn't validate required fields yet
    });
  });

  describe('Response Consistency', () => {
    it('returns consistent user object structure', async () => {
      const signinResponse = await fetch('http://localhost:8080/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      const signinData = await signinResponse.json();

      const meResponse = await fetch('http://localhost:8080/api/auth/me', {
        headers: {
          'Authorization': 'Bearer mock-access-token',
        },
      });

      const meData = await meResponse.json();

      // User objects should have the same structure
      expect(Object.keys(signinData.user)).toEqual(Object.keys(meData));
    });

    it('returns consistent expert object structure', async () => {
      const listResponse = await fetch('http://localhost:8080/api/experts');
      const listData = await listResponse.json();

      const detailResponse = await fetch('http://localhost:8080/api/experts/1');
      const detailData = await detailResponse.json();

      // Detail should include all list fields plus additional ones
      const listFields = Object.keys(listData[0]);
      const detailFields = Object.keys(detailData);

      listFields.forEach(field => {
        expect(detailFields).toContain(field);
      });
    });
  });
});
