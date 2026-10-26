# AlgoVision - Interactive Sorting Visualizer

AlgoVision is a premium, educational web application designed to visualize and benchmark classical sorting algorithms. It helps developers and students understand Data Structures and Algorithms visually. 

## Features
- **Step-by-step Execution:** Visualizes comparisons, swaps, and sorted elements.
- **Algorithm Tracking:** Tracks comparisons, swaps, and execution time live.
- **Full Control:** Start, Pause, Resume, Reset, and Speed modifiers.
- **Comparison Engine:** Run multiple algorithms concurrently on the exact same dataset to compare performance metrics.
- **Educational References:** Includes Time/Space complexities, pseudocode, and a mapped Java implementation for students.

## Technologies Used
- HTML5 (Semantic Structure)
- CSS3 (Variables, Flexbox, Animations)
- Vanilla JavaScript (ES6 Modules, Generator Functions for Execution Control)
- **Zero Dependencies:** No external UI frameworks, React, or jQuery.

## Local Setup
1. Clone this repository.
2. Since ES6 Modules (`import/export`) are used, you cannot open `index.html` directly using the `file://` protocol due to CORS policy.
3. Serve the directory using any local web server. 
   - Using Python: `python -m http.server 8000`
   - Using Node: `npx serve .`
   - Using VSCode: Right-click `index.html` -> "Open with Live Server".

## Tests
The JavaScript sorting algorithms are decoupled from the UI and can be tested purely via Node.js.
```bash
node tests/algorithms.test.js