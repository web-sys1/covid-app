import { Injectable } from '@angular/core';

@Injectable()
export class JenksDataClassification {

    public getJenksClassification(data: number[], count: number): number[] {

        const sortedData = data.sort((a, b) => { return a - b });

        const mat1 = [];
        for (let x = 0, xl = sortedData.length + 1; x < xl; x++) {
            const temp = []
            for (let j = 0, jl = count + 1; j < jl; j++) {
                temp.push(0)
            }
            mat1.push(temp)
        }

        const mat2 = []
        for (let i = 0, il = sortedData.length + 1; i < il; i++) {
            const temp2 = []
            for (let c = 0, cl = count + 1; c < cl; c++) {
                temp2.push(0)
            }
            mat2.push(temp2)
        }

        for (let y = 1, yl = count + 1; y < yl; y++) {
            mat1[0][y] = 1
            mat2[0][y] = 0
            for (let t = 1, tl = sortedData.length + 1; t < tl; t++) {
                mat2[t][y] = Infinity
            }
            var v = 0.0
        }

        for (let l = 2, ll = sortedData.length + 1; l < ll; l++) {
            let s1 = 0.0
            let s2 = 0.0
            let w = 0.0
            for (let m = 1, ml = l + 1; m < ml; m++) {
                const i3 = l - m + 1
                const val = sortedData[i3 - 1]
                s2 += val * val
                s1 += val
                w += 1
                v = s2 - (s1 * s1) / w
                const i4 = i3 - 1
                if (i4 != 0) {
                    for (let p = 2, pl = count + 1; p < pl; p++) {
                        if (mat2[l][p] >= (v + mat2[i4][p - 1])) {
                            mat1[l][p] = i3
                            mat2[l][p] = v + mat2[i4][p - 1]
                        }
                    }
                }
            }
            mat1[l][1] = 1
            mat2[l][1] = v
        }

        let dataLength = sortedData.length;
        const kclass = []

        for (let i = 0; i <= count; i++) {
            kclass.push(0);
        }

        kclass[count] = sortedData[sortedData.length - 1]
        kclass[0] = sortedData[0]
        let countNum = count;
        while (countNum >= 2) {
            const id = mat1[dataLength][countNum] - 2;
            kclass[countNum - 1] = sortedData[id]
            dataLength = mat1[dataLength][countNum] - 1;

            countNum -= 1
        }

        if (kclass[0] == kclass[1]) {
            kclass[0] = 0
        }

        return kclass;
    }
}