import { THslColor, TRgbColor } from "../../types";
import { sanitizeHSL, sanitizeRGB } from "../sanitizers";

export function RGBtoHSL(rgb: TRgbColor) {
    const output: THslColor = { h: 0, s: 0, l: 0 };

    const Cmax = Math.max(rgb.r, rgb.g, rgb.b);
    const Cmin = Math.min(rgb.r, rgb.g, rgb.b);
    const delta = Cmax - Cmin;

    if (delta === 0) {
        output.h = 0;
    }
    else if (Cmax === rgb.r) {
        output.h = 60 * (((rgb.g - rgb.b) / delta) % 6);
    }
    else if (Cmax === rgb.g) {
        output.h = 60 * ((rgb.b - rgb.r) / delta + 2);
    }
    else if (Cmax === rgb.b) {
        output.h = 60 * ((rgb.r - rgb.g) / delta + 4);
    }

    if (Cmax === 0) {
        output.s = 0;
    }
    else {
        output.s = delta / Cmax;
    }

    output.l = (Cmin + Cmax) / 2;

    return sanitizeHSL(output);
}

export function HSLtoRGB(hsl: THslColor) {
    const c = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s;
    const x = c * (1 - Math.abs((hsl.h / 60) % 2 - 1));
    const m = hsl.l - c/2;
    let rU, gU, bU;

    if (hsl.h < 60) {
        [rU, gU, bU] = [c, x, 0];
    }
    else if (hsl.h < 120) {
        [rU, gU, bU] = [x, c, 0];
    }
    else if (hsl.h < 180) {
        [rU, gU, bU] = [0, c, x];
    }
    else if (hsl.h < 240) {
        [rU, gU, bU] = [0, x, c];
    }
    else if (hsl.h < 300) {
        [rU, gU, bU] = [x, 0, c];
    }
    else {
        [rU, gU, bU] = [c, 0, x];
    }

    return sanitizeRGB({
        r: rU + m,
        g: gU + m,
        b: bU + m
    });
}
