import { THsvColor, TLabColor, TRgbColor, TXyzColor } from "../types";
import { Matrix } from "../class/SMatrix";

export function RGBtoHSV(input: TRgbColor) {
    const output: THsvColor = { h: 0, s: 0, v: 0 };

    const Cmax = Math.max(input.r, input.g, input.b);
    const Cmin = Math.min(input.r, input.g, input.b);
    const delta = Cmax - Cmin;

    if (delta === 0) {
        output.h = 0;
    }
    else if (Cmax === input.r) {
        output.h = 60 * (((input.g - input.b) / delta) % 6);
    }
    else if (Cmax === input.g) {
        output.h = 60 * ((input.b - input.r) / delta + 2);
    }
    else if (Cmax === input.b) {
        output.h = 60 * ((input.r - input.g) / delta + 4);
    }

    if (Cmax === 0) {
        output.s = 0;
    }
    else {
        output.s = delta / Cmax;
    }

    output.v = Cmax;

    return output;
}

export function HSVtoRGB(input: THsvColor) {
    const c = input.v * input.s;
    const x = c * (1 - Math.abs((input.h / 60) % 2 - 1));
    const m = input.v - c;
    let rU, gU, bU;

    if (input.h < 60) {
        [rU, gU, bU] = [c, x, 0];
    }
    else if (input.h < 120) {
        [rU, gU, bU] = [x, c, 0];
    }
    else if (input.h < 180) {
        [rU, gU, bU] = [0, c, x];
    }
    else if (input.h < 240) {
        [rU, gU, bU] = [0, x, c];
    }
    else if (input.h < 300) {
        [rU, gU, bU] = [x, 0, c];
    }
    else {
        [rU, gU, bU] = [c, 0, x];
    }

    return {
        r: rU + m,
        g: gU + m,
        b: bU + m
    } as TRgbColor;
}

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

export function XYZtoLAB(input: TXyzColor) {
    const x = input.x, y = input.y, z = input.z;
    const xn = 95.0489, yn = 100, zn = 108.8840;

    return {
        l: 116 * f(y / yn) - 16,
        a: 500 * (f(x / xn) - f(y / yn)),
        b: 200 * (f(y / yn) - f(z / zn))
    } as TLabColor;

    function f(t) {
        const d = 6 / 29;
        if (t > d * d * d) {
            return Math.cbrt(t);
        }
        else {
            return t / (3 * d * d) + 4 / 29;
        }
    }
}

export function LABtoXYZ(input: TLabColor) {
    const l = input.l, a = input.a, b = input.b;
    const xn = 95.0489, yn = 100, zn = 108.8840;

    return {
        x: xn * f((l + 16) / 116 + a / 500),
        y: yn * f((l + 16) / 116),
        z: zn * f((l + 16) / 116 - b / 200)
    } as TXyzColor;

    function f(t) {
        const d = 6 / 29;
        if (t > d) {
            return t * t * t;
        }
        else {
            return 3 * d * d * (t - 4 / 29);
        }
    }
}
