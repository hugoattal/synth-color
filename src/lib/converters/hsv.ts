import { THsvColor, TRgbColor } from "../../types";
import { sanitizeHSV, sanitizeRGB } from "../sanitizers";

export function RGBtoHSV(rgb: TRgbColor) {
    const output: THsvColor = { h: 0, s: 0, v: 0 };

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

    output.v = Cmax;

    return sanitizeHSV(output);
}

export function HSVtoRGB(hsv: THsvColor) {
    const c = hsv.v * hsv.s;
    const x = c * (1 - Math.abs((hsv.h / 60) % 2 - 1));
    const m = hsv.v - c;
    let rU, gU, bU;

    if (hsv.h < 60) {
        [rU, gU, bU] = [c, x, 0];
    }
    else if (hsv.h < 120) {
        [rU, gU, bU] = [x, c, 0];
    }
    else if (hsv.h < 180) {
        [rU, gU, bU] = [0, c, x];
    }
    else if (hsv.h < 240) {
        [rU, gU, bU] = [0, x, c];
    }
    else if (hsv.h < 300) {
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
