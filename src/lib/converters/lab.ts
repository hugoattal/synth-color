import { TLabColor, TXyzColor } from "../../types";

// D65
const white: TXyzColor = {
    x: 95.0489,
    y: 100,
    z: 108.8840
};

// D 50
//const xn = 96.4212, yn = 100, zn = 82.5188;

export function XYZtoLAB(xyz: TXyzColor) {
    return {
        l: 116 * f(xyz.y / white.y) - 16,
        a: 500 * (f(xyz.x / white.x) - f(xyz.y / white.y)),
        b: 200 * (f(xyz.y / white.y) - f(xyz.z / white.z))
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

export function LABtoXYZ(lab: TLabColor) {
    return {
        x: white.x * f((lab.l + 16) / 116 + lab.a / 500),
        y: white.y * f((lab.l + 16) / 116),
        z: white.z * f((lab.l + 16) / 116 - lab.b / 200)
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
