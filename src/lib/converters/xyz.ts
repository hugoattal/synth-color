import { TRgbColor, TXyzColor } from "../../types";
import { Matrix } from "../../class/SMatrix";

export function RGBtoXYZ(input: TRgbColor) {
    const matrix = new Matrix([
        0.4124564, 0.3575761, 0.1804375,
        0.2126729, 0.7151522, 0.0721750,
        0.0193339, 0.1191920, 0.9503041
    ]);

    const r = pivotRgb(input.r);
    const g = pivotRgb(input.g);
    const b = pivotRgb(input.b);

    const { X: x, Y: y, Z: z } = matrix.multiply([r, g, b]);
    return { x, y, z } as TXyzColor;

    function pivotRgb(n) {
        return (n > 0.04045 ? Math.pow((n + 0.055) / 1.055, 2.4) : n / 12.92) * 100;
    }
}

export function XYZtoRGB(input: TXyzColor) {
    const matrix = new Matrix([
        3.2404542, -1.5371385, -0.4985314,
        -0.9692660, 1.8760108, 0.0415560,
        0.0556434, -0.2040259, 1.0572252
    ]);

    const { X: r, Y: g, Z: b } = matrix.multiply([input.x, input.y, input.z]);

    return {
        r: pivotRgb(r),
        g: pivotRgb(g),
        b: pivotRgb(b)
    } as TRgbColor;

    function pivotRgb(n) {
        n /= 100;
        return (n > 0.003131 ? Math.pow(n, 1 / 2.4) * 1.055 - 0.055 : n * 12.92);
    }
}
