import { TLuvColor, TXyzColor } from "../../types";

const xn = 95.0489, yn = 100, zn = 108.8840;
const un = 0.2009, vn = 0.4610;

export function XYZtoLUV(input: TXyzColor) {
    const x = input.x, y = input.y, z = input.z;

    const l = 116 * f(y / yn) - 16;
    const up = 4 * x / (x + 15 * y + 3 * z);
    const vp = 9 * y / (x + 15 * y + 3 * z);

    return {
        l,
        u: 13 * l * (up - un),
        v: 13 * l * (vp - vn)
    } as TLuvColor;


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

export function LUVtoXYZ(input: TLuvColor) {
    const l = input.l, u = input.u, v = input.v;

    const up = u / 13 * l + un;
    const vp = v / 13 * l + vn;

    const xp = 9 * up / (6 * up - 16 * vp + 12);
    const yp = 4 * vp / (6 * up - 16 * vp + 12);

    const y = yn * f((l + 16) / 116);

    return {
        x: xp * y / yp,
        y,
        z: (1 - xp - yp) * y / yp
    } as TXyzColor;

    function f(t) {
        const d = 6 / 29;
        if (t > 8) {
            return t * t * t;
        }
        else {
            return 3 * d * d * (t - 4 / 29);
        }
    }
}
