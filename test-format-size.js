// Simple test script for the formatSize function

// Copy of the formatSize function for testing
function formatSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Test cases
const testCases = [
  { input: 0, expected: '0 Bytes' },
  { input: 500, expected: '500 Bytes' },
  { input: 1024, expected: '1 KB' },
  { input: 1500, expected: '1.46 KB' },
  { input: 1024 * 1024, expected: '1 MB' },
  { input: 1024 * 1024 * 2.5, expected: '2.5 MB' },
  { input: 1024 * 1024 * 1024, expected: '1 GB' },
  { input: 1024 * 1024 * 1024 * 1024, expected: '1 TB' },
  { input: 20 * 1024 * 1024, expected: '20 MB' } // Max file size in FileUploader
];

// Run tests
console.log('Testing formatSize function:');
console.log('----------------------------');

let allPassed = true;

testCases.forEach((test, index) => {
  const result = formatSize(test.input);
  const passed = result === test.expected;
  
  console.log(`Test ${index + 1}: ${passed ? 'PASSED' : 'FAILED'}`);
  console.log(`  Input: ${test.input} bytes`);
  console.log(`  Expected: "${test.expected}"`);
  console.log(`  Actual: "${result}"`);
  
  if (!passed) {
    allPassed = false;
  }
});

console.log('----------------------------');
console.log(`Overall result: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);