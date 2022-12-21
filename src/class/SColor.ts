import { SValue } from "./SValue";
import { THslColor, THsvColor, TLabColor, TLuvColor, TRgbColor, TXyzColor } from "../types";
import { getColorProxy } from "../lib/colorProxy";
import { LABtoXYZ, XYZtoLAB } from "../lib/converters/lab";
import { LUVtoXYZ, XYZtoLUV } from "../lib/converters/luv";
import { RGBtoXYZ, XYZtoRGB } from "../lib/converters/xyz";
import { HSLtoRGB, RGBtoHSL } from "../lib/converters/hsl";
import { HSVtoRGB, RGBtoHSV } from "../lib/converters/hsv";
import { SMath } from "../lib/SMath";

export type TModels = {
    rgb: TRgbColor;
    lab: TLabColor;
    hsl: THslColor;
    hsv: THsvColor;
    luv: TLuvColor;
    xyz: TXyzColor;
}

export type TColorInternal = {
    alpha: number,
    models: {
        rgb?: SValue<TRgbColor>;
        lab?: SValue<TLabColor>;
        hsl?: SValue<THslColor>;
        hsv?: SValue<THsvColor>;
        luv?: SValue<TLuvColor>;
        xyz?: SValue<TXyzColor>;
    }
}

export class SColor {
    private internal: TColorInternal = {
        alpha: 1,
        models: {}
    };

    rgb: TRgbColor;
    lab: TLabColor;
    hsl: THslColor;
    hsv: THsvColor;
    luv: TLuvColor;
    xyz: TXyzColor;

    rgba: TRgbColor & { alpha: number };
    laba: TLabColor & { alpha: number };
    hsla: THslColor & { alpha: number };
    hsva: THsvColor & { alpha: number };
    luva: TLuvColor & { alpha: number };
    xyza: TXyzColor & { alpha: number };

    alpha: number;

    setModel<T extends keyof TModels>(modelKey: T, value: TModels[T]) {
        if (!this.internal.models[modelKey]) {
            this.internal.models[modelKey] = new SValue<TModels[T]>(value) as any;
        }
        else {
            this.internal.models[modelKey].value = value;
        }
    }

    updateModel(modelKey: keyof TModels) {
        for (const key of Object.keys(this.internal.models)) {
            if (key === modelKey) {
                continue;
            }
            this.internal.models[key].invalidate();
        }
    }

    constructor(value?: string | TRgbColor | THslColor | THsvColor) {
        this.setModel("rgb", { r: 0, g: 0, b: 0 });

        if (!value) {
            return getColorProxy(this, this.internal);
        }

        if (typeof value === "string") {
            if (value.startsWith("#")) {
                this.parseHex(value);
            }
            else if (value.startsWith("rgb")) {
                const array = value.match(/rgba?\((.+)\)/)[1].split(",").map((v) => parseFloat(v));
                this.parseRgbArray(array);
            }
            else if (value.startsWith("hsl")) {
                const array = value.match(/hsla?\((.+)\)/)[1].split(",").map((v) => parseFloat(v));
                this.parseHslArray(array);
            }

            return getColorProxy(this, this.internal);
        }

        if ("r" in value && "g" in value && "b" in value) {
            this.setModel("rgb", value);
        }
        else if ("h" in value && "s" in value && "l" in value) {
            this.setModel("hsl", value);
        }
        else if ("h" in value && "s" in value && "v" in value) {
            this.setModel("hsv", value);
        }

        return getColorProxy(this, this.internal);
    }

    parseHex(value: string) {
        const hex = value.substring(1);

        if (hex.length === 3) {
            this.setModel("rgb", {
                r: parseInt(hex[0] + hex[0], 16) / 255,
                g: parseInt(hex[1] + hex[1], 16) / 255,
                b: parseInt(hex[2] + hex[2], 16) / 255
            });
        }

        if (hex.length === 6 || hex.length === 8) {
            this.setModel("rgb", {
                r: parseInt(hex[0] + hex[1], 16) / 255,
                g: parseInt(hex[2] + hex[3], 16) / 255,
                b: parseInt(hex[4] + hex[5], 16) / 255
            });
        }

        this.updateModel("rgb");

        if (hex.length === 8) {
            this.internal.alpha = parseInt(hex[6] + hex[7], 16) / 255;
        }
        else {
            this.internal.alpha = 1;
        }
    }

    get hex() {
        this.computeModel("rgb");

        let hex = "#";
        hex += Math.round(this.internal.models.rgb.value.r * 255).toString(16).padStart(2, "0");
        hex += Math.round(this.internal.models.rgb.value.g * 255).toString(16).padStart(2, "0");
        hex += Math.round(this.internal.models.rgb.value.b * 255).toString(16).padStart(2, "0");
        hex += this.internal.alpha < 1 ? Math.round(this.internal.alpha * 255).toString(16).padStart(2, "0") : "";

        return hex;
    }

    set hex(value:string) {}

    get rgbString() {
        this.computeModel("rgb");

        let string = "rgb";
        string += this.internal.alpha < 1 ? "a" : "";
        string += "(";
        string += Object.values(this.internal.models.rgb.value).map(v => Math.round(v * 255)).join(",");
        string += this.internal.alpha < 1 ? "," + this.internal.alpha * 100 + "%" : "";
        string += ")";
        return string;
    }

    get hslString() {
        this.computeModel("hsl");

        let string = "hsl";
        string += this.internal.alpha < 1 ? "a" : "";
        string += "(" + this.internal.models.hsl.value.h + ","
            + (this.internal.models.hsl.value.s * 100) + "%,"
            + (this.internal.models.hsl.value.l * 100) + "%";
        string += this.internal.alpha < 1 ? "," + this.internal.alpha * 100 + "%" : "";
        string += ")";
        return string;
    }

    parseRgbArray(value: Array<number>) {
        this.setModel("rgb", {
            r: value[0] / 255,
            g: value[1] / 255,
            b: value[2] / 255
        });


        this.updateModel("rgb");
        this.setAlpha(value[3]);
    }

    parseHslArray(value: Array<number>) {
        this.setModel("hsl", {
            h: value[0],
            s: value[1] / 100,
            l: value[2] / 100
        });

        this.updateModel("hsl");
        this.setAlpha(value[3]);
    }

    computeModel(modelKey: keyof TModels) {
        if (this.internal.models[modelKey]?.ready) {
            return;
        }

        switch (modelKey) {
            case "lab":
                this.computeModel("xyz");
                this.setModel("lab", XYZtoLAB(this.internal.models.xyz.value));
                break;
            case "luv":
                this.computeModel("xyz");
                this.setModel("luv", XYZtoLUV(this.internal.models.xyz.value));
                break;
            case "xyz":
                if (this.internal.models.lab?.ready) {
                    this.setModel("xyz", LABtoXYZ(this.internal.models.lab.value));
                    break;
                }
                if (this.internal.models.luv?.ready) {
                    this.setModel("xyz", LUVtoXYZ(this.internal.models.luv.value));
                    break;
                }
                this.computeModel("rgb");
                this.setModel("xyz", RGBtoXYZ(this.internal.models.rgb.value));
                break;
            case "hsl":
                this.computeModel("rgb");
                this.setModel("hsl", RGBtoHSL(this.internal.models.rgb.value));
                break;
            case "hsv":
                this.computeModel("rgb");
                this.setModel("hsv", RGBtoHSV(this.internal.models.rgb.value));
                break;
            case "rgb":
                if (this.internal.models.hsl?.ready) {
                    this.setModel("rgb", HSLtoRGB(this.internal.models.hsl.value));
                    break;
                }
                if (this.internal.models.hsv?.ready) {
                    this.setModel("rgb", HSVtoRGB(this.internal.models.hsv.value));
                    break;
                }
                this.computeModel("xyz");
                this.setModel("rgb", XYZtoRGB(this.internal.models.xyz.value));
        }
    }

    setAlpha(alpha: number) {
        if (alpha <= 1) {
            this.internal.alpha = SMath.clamp(alpha, 0, 1);
            return;
        }

        this.internal.alpha = SMath.clamp(alpha / 100, 0, 1);
    }
}
