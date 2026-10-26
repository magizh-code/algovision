export class Visualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.bars = [];
        this.abortController = null;
        this.isPaused = false;
        this.resolvePause = null;
        this.sortedIndices = new Set();
    }

    drawInitialArray(array) {
        this.container.innerHTML = '';
        this.bars = [];
        this.sortedIndices.clear();
        
        const maxValue = Math.max(...array, 1); // Avoid division by zero
        array.forEach((val, idx) => {
            const bar = document.createElement('div');
            bar.classList.add('array-bar');
            bar.style.height = `${(val / maxValue) * 100}%`;
            this.container.appendChild(bar);
            this.bars.push(bar);
        });
    }

    updateBars(state) {
        const { type, indices, array } = state;
        
        // Reset colors for non-sorted elements
        this.bars.forEach((bar, idx) => {
            if (!this.sortedIndices.has(idx)) {
                bar.className = 'array-bar';
            }
        });

        if (type === 'sorted') {
            indices.forEach(i => {
                this.sortedIndices.add(i);
                this.bars[i].className = 'array-bar sorted';
            });
        } else {
            const cssClass = type === 'compare' ? 'compare' : 'swap';
            indices.forEach(i => {
                if(this.bars[i]) this.bars[i].className = `array-bar ${cssClass}`;
            });
        }

        // Update heights safely
        const maxValue = Math.max(...array, 1);
        array.forEach((val, idx) => {
            this.bars[idx].style.height = `${(val / maxValue) * 100}%`;
        });
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async pauseWait() {
        if (!this.isPaused) return;
        return new Promise(resolve => { this.resolvePause = resolve; });
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused && this.resolvePause) {
            this.resolvePause();
            this.resolvePause = null;
        }
        return this.isPaused;
    }

    stop() {
        if (this.abortController) {
            this.abortController.abort();
        }
        if (this.isPaused && this.resolvePause) {
            this.isPaused = false;
            this.resolvePause();
        }
    }

    async run(generatorFunc, array, speedRef, onUpdate, onComplete) {
        this.stop();
        this.abortController = new AbortController();
        const signal = this.abortController.signal;
        
        const gen = generatorFunc(array);
        const startTime = performance.now();
        
        try {
            while (true) {
                if (signal.aborted) return;
                await this.pauseWait();
                if (signal.aborted) return;

                const { value, done } = gen.next();
                if (done) {
                    const endTime = performance.now();
                    // Final draw to ensure all are green
                    const finalArray = value.array;
                    finalArray.forEach((_, i) => this.sortedIndices.add(i));
                    this.updateBars({ type: 'sorted', indices: [], array: finalArray });
                    onComplete(value.stats, endTime - startTime);
                    return;
                }

                this.updateBars(value);
                onUpdate(value.stats, performance.now() - startTime);
                
                // Speed formula: 100 is max speed (0ms), 1 is min speed (500ms)
                const delay = 500 - ((speedRef.value - 1) * (500 / 99));
                if (delay > 0) await this.sleep(delay);
            }
        } catch (e) {
            console.log("Visualization terminated.");
        }
    }
}