/**
 * Lightweight Node.js test runner for sorting algorithms.
 * Run via: node tests/algorithms.test.js
 */
import { bubbleSort, selectionSort, insertionSort } from '../js/algorithms.js';

function runSort(algo, arr) {
    const gen = algo(arr);
    let result;
    while (true) {
        result = gen.next();
        if (result.done) break;
    }
    return result.value.array; // Final sorted array
}

const testCases = [
    { name: "Empty array", input: [], expected: [] },
    { name: "Single element", input: [42], expected: [42] },
    { name: "Sorted array", input: [1, 2, 3, 4, 5], expected: [1, 2, 3, 4, 5] },
    { name: "Reverse sorted", input: [5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5] },
    { name: "Duplicates", input: [3, 1, 3, 2, 1, 5], expected: [1, 1, 2, 3, 3, 5] },
    { name: "Negative values", input: [-1, -5, 2, 0], expected: [-5, -1, 0, 2] },
    { name: "All equal", input: [7, 7, 7, 7], expected: [7, 7, 7, 7] },
];

function runTests() {
    const algos = { bubbleSort, selectionSort, insertionSort };
    let passed = 0, total = 0;
    
    console.log("=== AlgoVision Test Suite ===\n");
    for (const [name, algo] of Object.entries(algos)) {
        console.log(`Testing ${name}...`);
        for (const tc of testCases) {
            total++;
            const output = runSort(algo, tc.input);
            const isMatch = JSON.stringify(output) === JSON.stringify(tc.expected);
            if (isMatch) {
                passed++;
                console.log(`  [PASS] ${tc.name}`);
            } else {
                console.error(`  [FAIL] ${tc.name} \n    Expected: ${tc.expected}\n    Got:      ${output}`);
            }
        }
        console.log("");
    }
    console.log(`Results: ${passed}/${total} passed.`);
    if(passed !== total) process.exit(1);
}

runTests();