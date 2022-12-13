import { THsvColor, TRgbColor } from "../../types";

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
