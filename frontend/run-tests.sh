#!/bin/bash

# Frontend Test Runner Script for Shop Experts Application
# This script runs comprehensive test suites with detailed reporting

set -e

echo "🧪 Starting Shop Experts Frontend Test Suite"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create coverage directory if it doesn't exist
mkdir -p coverage

# Function to run test suite
run_test_suite() {
    local test_name=$1
    local test_command=$2
    local description=$3
    
    echo ""
    print_status "Running $test_name..."
    echo "Description: $description"
    echo "Command: $test_command"
    echo "----------------------------------------"
    
    if eval "$test_command"; then
        print_success "$test_name completed successfully"
    else
        print_error "$test_name failed"
        return 1
    fi
}

# Check if Node.js and npm are available
print_status "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

print_success "Prerequisites check passed"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
fi

# Test suites configuration
declare -A test_suites=(
    ["Unit Tests"]="npm run test:ci|Unit tests for individual components, services, and utilities"
    ["Integration Tests"]="npm run test:integration|End-to-end user workflow testing"
    ["Accessibility Tests"]="npm run test:accessibility|WCAG compliance and accessibility testing"
    ["Performance Tests"]="npm run test:performance|Performance benchmarking and optimization testing"
    ["Handler Tests"]="npm run test:handlers|MSW mock service worker handler testing"
)

# Component-specific test suites
declare -A component_suites=(
    ["Component Tests"]="npm run test:components|React component unit testing"
    ["Page Tests"]="npm run test:pages|Page component testing"
    ["Service Tests"]="npm run test:services|API service and utility testing"
    ["Context Tests"]="npm run test:context|React context and state management testing"
)

# Parse command line arguments
COVERAGE_REPORT=false
VERBOSE=false
SPECIFIC_SUITE=""
SKIP_SLOW=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --coverage)
            COVERAGE_REPORT=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --suite)
            SPECIFIC_SUITE="$2"
            shift 2
            ;;
        --skip-slow)
            SKIP_SLOW=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --coverage     Generate and display coverage report"
            echo "  --verbose      Show detailed test output"
            echo "  --suite NAME   Run specific test suite only"
            echo "  --skip-slow    Skip performance and integration tests"
            echo "  --help         Show this help message"
            echo ""
            echo "Available test suites:"
            for suite in "${!test_suites[@]}"; do
                echo "  - $suite"
            done
            for suite in "${!component_suites[@]}"; do
                echo "  - $suite"
            done
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Track test results
failed_tests=()
passed_tests=()

# Function to run a specific test suite
run_specific_suite() {
    local suite_name=$1
    local suite_config=$2
    
    IFS='|' read -r command description <<< "$suite_config"
    
    if run_test_suite "$suite_name" "$command" "$description"; then
        passed_tests+=("$suite_name")
    else
        failed_tests+=("$suite_name")
    fi
}

# Run specific suite if requested
if [[ -n "$SPECIFIC_SUITE" ]]; then
    print_status "Running specific test suite: $SPECIFIC_SUITE"
    
    if [[ -n "${test_suites[$SPECIFIC_SUITE]}" ]]; then
        run_specific_suite "$SPECIFIC_SUITE" "${test_suites[$SPECIFIC_SUITE]}"
    elif [[ -n "${component_suites[$SPECIFIC_SUITE]}" ]]; then
        run_specific_suite "$SPECIFIC_SUITE" "${component_suites[$SPECIFIC_SUITE]}"
    else
        print_error "Unknown test suite: $SPECIFIC_SUITE"
        exit 1
    fi
else
    # Run all test suites
    print_status "Running all test suites..."
    
    # Run component tests first
    for suite in "${!component_suites[@]}"; do
        run_specific_suite "$suite" "${component_suites[$suite]}"
    done
    
    # Run main test suites
    for suite in "${!test_suites[@]}"; do
        # Skip slow tests if requested
        if [[ "$SKIP_SLOW" == true && ("$suite" == "Performance Tests" || "$suite" == "Integration Tests") ]]; then
            print_warning "Skipping $suite (slow test)"
            continue
        fi
        
        run_specific_suite "$suite" "${test_suites[$suite]}"
    done
fi

# Generate coverage report if requested
if [[ "$COVERAGE_REPORT" == true ]]; then
    echo ""
    print_status "Generating coverage report..."
    
    if npm run test:coverage > coverage/test-output.log 2>&1; then
        print_success "Coverage report generated in coverage/ directory"
        
        # Display coverage summary
        if [[ -f "coverage/lcov-report/index.html" ]]; then
            print_status "Coverage report available at: coverage/lcov-report/index.html"
        fi
        
        # Extract coverage summary
        if [[ -f "coverage/coverage-summary.json" ]]; then
            print_status "Coverage Summary:"
            node -e "
                const fs = require('fs');
                const summary = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'));
                const total = summary.total;
                console.log('Lines: ' + total.lines.pct + '%');
                console.log('Functions: ' + total.functions.pct + '%');
                console.log('Branches: ' + total.branches.pct + '%');
                console.log('Statements: ' + total.statements.pct + '%');
            "
        fi
    else
        print_error "Coverage report generation failed"
        failed_tests+=("Coverage Report")
    fi
fi

# Display final results
echo ""
echo "============================================="
print_status "Test Suite Results Summary"
echo "============================================="

if [[ ${#passed_tests[@]} -gt 0 ]]; then
    print_success "Passed Tests (${#passed_tests[@]}):"
    for test in "${passed_tests[@]}"; do
        echo "  ✅ $test"
    done
fi

if [[ ${#failed_tests[@]} -gt 0 ]]; then
    echo ""
    print_error "Failed Tests (${#failed_tests[@]}):"
    for test in "${failed_tests[@]}"; do
        echo "  ❌ $test"
    done
fi

echo ""
total_tests=$((${#passed_tests[@]} + ${#failed_tests[@]}))
print_status "Total Tests Run: $total_tests"
print_status "Passed: ${#passed_tests[@]}"
print_status "Failed: ${#failed_tests[@]}"

# Generate test report
cat > coverage/test-report.md << EOF
# Shop Experts Frontend Test Report

Generated on: $(date)

## Test Suite Results

### Summary
- **Total Tests:** $total_tests
- **Passed:** ${#passed_tests[@]}
- **Failed:** ${#failed_tests[@]}
- **Success Rate:** $(( (${#passed_tests[@]} * 100) / total_tests ))%

### Passed Tests
$(for test in "${passed_tests[@]}"; do echo "- ✅ $test"; done)

### Failed Tests
$(for test in "${failed_tests[@]}"; do echo "- ❌ $test"; done)

## Test Coverage
$(if [[ "$COVERAGE_REPORT" == true ]]; then
    echo "Coverage report generated in \`coverage/lcov-report/index.html\`"
else
    echo "Coverage report not generated (use --coverage flag)"
fi)

## Next Steps
$(if [[ ${#failed_tests[@]} -gt 0 ]]; then
    echo "1. Review failed tests and fix issues"
    echo "2. Re-run tests to verify fixes"
else
    echo "All tests passed! 🎉"
fi)
EOF

print_success "Test report generated: coverage/test-report.md"

# Exit with appropriate code
if [[ ${#failed_tests[@]} -eq 0 ]]; then
    echo ""
    print_success "🎉 All tests passed successfully!"
    exit 0
else
    echo ""
    print_error "❌ Some tests failed. Please review and fix the issues."
    exit 1
fi
