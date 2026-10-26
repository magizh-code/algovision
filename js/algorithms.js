// Algorithms yield step-by-step states for visualization.
// Yield object: { type: 'compare'|'swap'|'write'|'sorted', indices: [array of indices], array: [current state], stats: {comparisons, swaps, writes} }

export function* bubbleSort(inputArray) {
    let arr = [...inputArray];
    let n = arr.length;
    let comparisons = 0, swaps = 0, writes = 0;

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            comparisons++;
            yield { type: 'compare', indices: [j, j + 1], array: [...arr], stats: { comparisons, swaps, writes } };
            
            if (arr[j] > arr[j + 1]) {
                swaps++;
                writes += 2;
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
                yield { type: 'swap', indices: [j, j + 1], array: [...arr], stats: { comparisons, swaps, writes } };
            }
        }
        yield { type: 'sorted', indices: [n - i - 1], array: [...arr], stats: { comparisons, swaps, writes } };
        
        // Early termination optimization
        if (!swapped) {
            for (let k = 0; k < n - i - 1; k++) {
                yield { type: 'sorted', indices: [k], array: [...arr], stats: { comparisons, swaps, writes } };
            }
            break;
        }
    }
    if(n > 0) yield { type: 'sorted', indices: [0], array: [...arr], stats: { comparisons, swaps, writes } };
    return { array: arr, stats: { comparisons, swaps, writes } };
}

export function* selectionSort(inputArray) {
    let arr = [...inputArray];
    let n = arr.length;
    let comparisons = 0, swaps = 0, writes = 0;

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            comparisons++;
            yield { type: 'compare', indices: [minIdx, j], array: [...arr], stats: { comparisons, swaps, writes } };
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx !== i) {
            swaps++;
            writes += 2;
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            yield { type: 'swap', indices: [i, minIdx], array: [...arr], stats: { comparisons, swaps, writes } };
        }
        yield { type: 'sorted', indices: [i], array: [...arr], stats: { comparisons, swaps, writes } };
    }
    if(n > 0) yield { type: 'sorted', indices: [n - 1], array: [...arr], stats: { comparisons, swaps, writes } };
    return { array: arr, stats: { comparisons, swaps, writes } };
}

export function* insertionSort(inputArray) {
    let arr = [...inputArray];
    let n = arr.length;
    let comparisons = 0, swaps = 0, writes = 0;

    if(n > 0) yield { type: 'sorted', indices: [0], array: [...arr], stats: { comparisons, swaps, writes } };

    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        writes++; // Read/assign key counts as write in standard tracking

        while (j >= 0) {
            comparisons++;
            yield { type: 'compare', indices: [j, j + 1], array: [...arr], stats: { comparisons, swaps, writes } };
            if (arr[j] > key) {
                arr[j + 1] = arr[j];
                writes++;
                yield { type: 'swap', indices: [j, j + 1], array: [...arr], stats: { comparisons, swaps, writes } };
                j--;
            } else {
                break;
            }
        }
        arr[j + 1] = key;
        writes++;
        yield { type: 'swap', indices: [j + 1], array: [...arr], stats: { comparisons, swaps, writes } };

        for(let k = 0; k <= i; k++) {
            yield { type: 'sorted', indices: [k], array: [...arr], stats: { comparisons, swaps, writes } };
        }
    }
    return { array: arr, stats: { comparisons, swaps, writes } };
}