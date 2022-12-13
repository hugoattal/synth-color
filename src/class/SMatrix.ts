export class Matrix {
    matrix: Array<number>;

    constructor(matrix) {
        this.matrix = matrix;
    }

    multiply(vector) {
        const c0r0 = this.matrix[0], c1r0 = this.matrix[1], c2r0 = this.matrix[2];
        const c0r1 = this.matrix[3], c1r1 = this.matrix[4], c2r1 = this.matrix[5];
        const c0r2 = this.matrix[6], c1r2 = this.matrix[7], c2r2 = this.matrix[8];

        const x = vector[0];
        const y = vector[1];
        const z = vector[2];

        const X = (x * c0r0) + (y * c1r0) + (z * c2r0);
        const Y = (x * c0r1) + (y * c1r1) + (z * c2r1);
        const Z = (x * c0r2) + (y * c1r2) + (z * c2r2);

        return { X, Y, Z };
    }
}
