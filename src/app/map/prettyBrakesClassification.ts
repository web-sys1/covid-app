import { Injectable } from '@angular/core';

@Injectable()
export class PrettyBreaksRangesGenerator {

    public calculateRanges(values: number[], classes: number): number[] {
        values.sort((a, b) => { return a - b });
        const valuesCount: number = values.length;
        let mean: number = 0.0;
        let minimum: number = Math.min(...values);
        let maximum: number = Math.max(...values);

        for (let i = 0; i < valuesCount; i++) {
            mean += values[i];
            minimum = Math.min(values[i], minimum);
            maximum = Math.max(values[i], maximum);
        }

        const breaks = this.prettyBreaks(minimum, maximum, classes);

        return breaks;
    }


    private prettyBreaks(minimum: number, maximum: number, classes: number): number[] {

        const breaks = new Array<number>();
        if (classes < 1) {
            breaks.push(maximum);
            return breaks;
        }

        const minimumCount: number = classes / 3;
        const shrink = 0.75;
        const highBias = 1.5;
        const adjustBias = 0.5 * 1.5 * highBias;
        const divisions = classes;
        const h = highBias;
        const dx = maximum - minimum;
        let cell: number;
        let small: boolean = false;

        if (this.doubleNear(dx, 0.0) && this.doubleNear(maximum, 0.0)) {
            cell = 1.0;
            small = true;
        } else {
            let U = 1;
            cell = Math.max(Math.abs(minimum), Math.abs(maximum));
            if (adjustBias >= 1.5 * h + 0.5) {
                U = 1 + (1.0 / (1 + h));
            } else {
                U = 1 + (1.5 / (1 + adjustBias));
            }
            small = dx < (cell * U * Math.max(1, divisions) * 1e-07 * 3.0);
        }

        if (small) {
            if (cell > 10) {
                cell = 9 + cell / 10;
                cell = cell * shrink;
            }
            if (minimumCount > 1) {
                cell = cell / minimumCount;
            }
        } else {
            cell = dx;
            if (divisions > 1) {
                cell = cell / divisions;
            }
        }
        if (cell < 20 * 1e-07) {
            cell = 20 * 1e-07;
        }

        const base: number = Math.pow(10.0, Math.floor(Math.log10(cell)));
        let unit = base;
        if ((2 * base) - cell < h * (cell - unit)) {
            unit = 2.0 * base;
            if ((5 * base) - cell < adjustBias * (cell - unit)) {
                unit = 5.0 * base;
                if ((10.0 * base) - cell < h * (cell - unit)) {
                    unit = 10.0 * base;
                }
            }
        }

        let start: number = Math.floor(minimum / unit + 1e-07);
        let end: number = Math.ceil(maximum / unit - 1e-07);

        while (start * unit > minimum - (1e-07 * unit)) {
            start = start - 1;
        }
        while (end * unit < maximum - (1e-07 * unit)) {
            end = end + 1;
        }

        let k: number = Math.floor(0.5 + end - start)
        if (k < minimumCount) {
            k = minimumCount - k;
            if (start >= 0) {
                end = end + k / 2;
                start = start - k / 2 + k % 2;
            } else {
                start = start - k / 2;
                end = end + k / 2 + k % 2;
            }
        }
        let minimumBreak: number = start * unit;
        let count: number = end - start;

        breaks.reverse();
        for (let i = 0; i < count + 1; i++) {
            breaks.push(minimumBreak + i * unit);
        }

        if (breaks.length === 0) {
            return breaks;
        }

        if (breaks[0] < minimum) {
            if (minimum != breaks[1])
                breaks[0] = minimum;
            else
                breaks.splice(0, 1);

        }
        if (breaks[breaks.length - 1] > maximum) {
            breaks[breaks.length - 1] = maximum;
        }

        return breaks;

    }

    private doubleNear(a: number, b: number, epsilon = 4 * Number.EPSILON): boolean {
        const diff: number = a - b;
        return diff > -1 * epsilon && diff <= epsilon;
    }

}