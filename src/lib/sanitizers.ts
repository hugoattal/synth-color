import { THslColor, THsvColor, TRgbColor } from "../types";
import { SMath } from "./SMath";

export function sanitizeRGB(color: TRgbColor): TRgbColor {
    return {
        r: SMath.clamp(color.r, 0, 1),
        g: SMath.clamp(color.g, 0, 1),
        b: SMath.clamp(color.b, 0, 1),
    }
}

export function sanitizeHSV(color: THsvColor): THsvColor {
    return {
        h: (color.h + 360) % 360,
        s: SMath.clamp(color.s, 0, 1),
        v: SMath.clamp(color.v, 0, 1)
    }
}

export function sanitizeHSL(color: THslColor): THslColor {
    return {
        h: (color.h + 360) % 360,
        s: SMath.clamp(color.s, 0, 1),
        l: SMath.clamp(color.l, 0, 1)
    }
}
