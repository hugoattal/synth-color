import { TLabColor, TXyzColor } from "../../types";

// D65
const xn = 95.0489, yn = 100, zn = 108.8840;

// D 50
//const xn = 96.4212, yn = 100, zn = 82.5188;

export function XYZtoLAB(input: TXyzColor) {
    const x = input.x, y = input.y, z = input.z;

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
