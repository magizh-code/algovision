import { bubbleSort, selectionSort, insertionSort } from './algorithms.js';
import { Visualizer } from './visualizer.js';

const algoData = {
    bubble: {
        name: "Bubble Sort",
        desc: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass is repeated until the list is sorted.",
        pseudo: "for i from 0 to n-1:\n  swapped = false\n  for j from 0 to n-i-1:\n    if a[j] > a[j+1]:\n      swap(a[j], a[j+1])\n      swapped = true\n  if not swapped: break",
        complexities: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" }
    },
    selection: {
        name: "Selection Sort",
        desc: "Divides the input list into a sorted and an unsorted region. It repeatedly selects the smallest element from the unsorted region and swaps it with the first element of the unsorted region.",
        pseudo: "for i from 0 to n-1:\n  minIdx = i\n  for j from i+1 to n:\n    if a[j] < a[minIdx]: minIdx = j\n  if minIdx != i:\n    swap(a[i], a[minIdx])",
        complexities: { best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" }
    },
    insertion: {
        name: "Insertion Sort",
        desc: "Builds the final sorted array one item at a time. It takes each element from the unsorted list and inserts it into its correct position in the sorted list.",
        pseudo: "for i from 1 to n-1:\n  key = a[i]\n  j = i - 1\n  while j >= 0 and a[j] > key:\n    a[j+1] = a[j]\n    j = j - 1\n  a[j+1] = key",
        complexities: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" }
    }
};

const mapAlgo = { bubble: bubbleSort, selection: selectionSort, insertion: insertionSort };

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const viz = new Visualizer('canvas-container');
    let currentArray = [];
    let originalArray = [];
    let isRunning = false;
    
    // DOM Cache
    const elAlgoSelect = document.getElementById('algo-select');
    const elSizeSlider = document.getElementById('size-slider');
    const elSizeVal = document.getElementById('size-val');
    const elSpeedSlider = document.getElementById('speed-slider');
    const elBtnGenerate = document.getElementById('btn-generate');
    const elBtnCustom = document.getElementById('btn-custom');
    const elCustomInput = document.getElementById('custom-input');
    const elBtnStart = document.getElementById('btn-start');
    const elBtnPause = document.getElementById('btn-pause');
    const elBtnReset = document.getElementById('btn-reset');
    
    // Stats Cache
    const stComp = document.getElementById('stat-comp');
    const stSwap = document.getElementById('stat-swap');
    const stWrite = document.getElementById('stat-write');
    const stTime = document.getElementById('stat-time');

    // Init
    document.getElementById('year').textContent = new Date().getFullYear();
    updateAlgoInfo();
    generateArray();

    // Navigation Logic
    document.querySelectorAll('nav a, .hero-buttons button').forEach(el => {
        el.addEventListener('click', (e) => {
            if (el.tagName === 'A' && el.target === "_blank") return;
            e.preventDefault();
            const targetId = el.dataset.target || (el.id === 'hero-launch-btn' ? 'visualizer-section' : 'learn-section');
            document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
            document.querySelectorAll('nav a').forEach(nav => nav.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            if (el.tagName === 'A') el.classList.add('active');
        });
    });

    // Event Listeners
    elSizeSlider.addEventListener('input', (e) => { elSizeVal.textContent = e.target.value; generateArray(); });
    elAlgoSelect.addEventListener('change', updateAlgoInfo);
    elBtnGenerate.addEventListener('click', generateArray);
    elBtnCustom.addEventListener('click', handleCustomArray);
    
    elBtnStart.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;
        elBtnStart.disabled = true;
        elBtnPause.disabled = false;
        
        const algoFunc = mapAlgo[elAlgoSelect.value];
        viz.run(algoFunc, [...currentArray], elSpeedSlider, updateStats, (finalStats, time) => {
            updateStats(finalStats, time);
            isRunning = false;
            elBtnStart.disabled = false;
            elBtnPause.disabled = true;
            elBtnPause.textContent = "Pause";
        });
    });

    elBtnPause.addEventListener('click', () => {
        const paused = viz.togglePause();
        elBtnPause.textContent = paused ? "Resume" : "Pause";
    });

    elBtnReset.addEventListener('click', () => {
        viz.stop();
        isRunning = false;
        elBtnStart.disabled = false;
        elBtnPause.disabled = true;
        elBtnPause.textContent = "Pause";
        currentArray = [...originalArray];
        viz.drawInitialArray(currentArray);
        resetStats();
    });

    // Compare Section Logic
    document.getElementById('btn-run-compare').addEventListener('click', () => {
        const arr = Array.from({length: 100}, () => Math.floor(Math.random() * 100) + 1);
        let html = `<table><tr><th>Algorithm</th><th>Comparisons</th><th>Swaps</th><th>Writes</th><th>Time (ms)</th></tr>`;
        
        Object.keys(mapAlgo).forEach(key => {
            const start = performance.now();
            const gen = mapAlgo[key]([...arr]);
            let res;
            while(true) { res = gen.next(); if(res.done) break; }
            const end = performance.now();
            const s = res.value.stats;
            html += `<tr><td>${algoData[key].name}</td><td>${s.comparisons}</td><td>${s.swaps}</td><td>${s.writes}</td><td>${(end - start).toFixed(2)}</td></tr>`;
        });
        html += `</table><p style="margin-top:1rem; color:var(--text-muted); font-size:0.9rem;">* Execution time varies based on browser JS engine optimization.</p>`;
        document.getElementById('compare-results').innerHTML = html;
    });

    // Helpers
    function generateArray() {
        viz.stop(); isRunning = false; elBtnStart.disabled = false; elBtnPause.disabled = true;
        const size = parseInt(elSizeSlider.value);
        currentArray = Array.from({length: size}, () => Math.floor(Math.random() * 100) + 5);
        originalArray = [...currentArray];
        viz.drawInitialArray(currentArray);
        resetStats();
    }

    function handleCustomArray() {
        const input = elCustomInput.value;
        const parsed = input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        if(parsed.length < 2) { alert("Please enter at least 2 comma-separated numbers."); return; }
        viz.stop(); isRunning = false; elBtnStart.disabled = false; elBtnPause.disabled = true;
        currentArray = parsed;
        originalArray = [...currentArray];
        viz.drawInitialArray(currentArray);
        resetStats();
    }

    function updateStats(stats, timeMs) {
        stComp.textContent = stats.comparisons;
        stSwap.textContent = stats.swaps;
        stWrite.textContent = stats.writes;
        stTime.textContent = timeMs.toFixed(2);
    }

    function resetStats() { updateStats({ comparisons: 0, swaps: 0, writes: 0 }, 0); }

    function updateAlgoInfo() {
        const data = algoData[elAlgoSelect.value];
        document.getElementById('algo-info').innerHTML = `
            <div>
                <h3>${data.name}</h3>
                <p>${data.desc}</p>
                <h4 style="margin-top: 1rem; color:var(--text-muted);">Complexities</h4>
                <ul class="complexities">
                    <li>Best Time: <strong>${data.complexities.best}</strong></li>
                    <li>Average Time: <strong>${data.complexities.avg}</strong></li>
                    <li>Worst Time: <strong>${data.complexities.worst}</strong></li>
                    <li>Space: <strong>${data.complexities.space}</strong></li>
                </ul>
            </div>
            <div>
                <h3>Pseudocode</h3>
                <pre>${data.pseudo}</pre>
            </div>
        `;
    }
});