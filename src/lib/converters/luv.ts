import { TLuvColor, TXyzColor } from "../../types";

const white: TXyzColor = {
    x: 95.0489,
    y: 100,
    z: 108.8840
};

function getDenXyz(xyz: TXyzColor) {
    return xyz.x + 15.0 * xyz.y + 3.0 * xyz.z;
}

function getDenUv({ up, vp }: { up: number, vp: number }) {
    return 6 * up - 16 * vp + 12;
}

export function XYZtoLUV(xyz: TXyzColor) {
    const l = 116 * f(xyz.y / white.y) - 16;

    const targetDenominator = getDenXyz(xyz);
    const whiteDenominator = getDenXyz(white);

    const up = 4 * xyz.x / targetDenominator;
    const vp = 9 * xyz.y / targetDenominator;

    const unp = 4 * white.x / whiteDenominator;
    const vnp = 9 * white.y / whiteDenominator;

    return {
        l,
        u: 13 * l * (up - unp),
        v: 13 * l * (vp - vnp)
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

export function LUVtoXYZ(luv: TLuvColor) {
    const whiteDenominator = getDenXyz(white);

    const unp = 4 * white.x / whiteDenominator;
    const vnp = 9 * white.y / whiteDenominator;

    const y = f((luv.l + 16) / 116);

    const up = luv.u / (13 * luv.l) + unp;
    const vp = luv.v / (13 * luv.l) + vnp;

    const denominator = getDenUv({ up, vp });
    const xp = 9 * up / denominator;
    const yp = 4 * vp / denominator;

    return {
        x: 100 * xp * y / yp,
        y: 100 * y,
        z: 100 * (1 - xp - yp) * y / yp
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
