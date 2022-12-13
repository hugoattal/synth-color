import { SValue } from "./SValue";
import { THslColor, THsvColor, TLabColor, TLuvColor, TRgbColor, TXyzColor } from "../types";
import { getColorProxy } from "../lib/colorProxy";

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

    setModel<T extends keyof TModels>(modelKey: T, value: TModels[T]) {
        for (const model of Object.values(this.internal.models)) {
            model.invalidate();
        }

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

    constructor(value: string) {
        if (value.startsWith("#")) {
            this.parseHex(value);
        }

        if (value.startsWith("rgb")) {
            const array = value.match(/rgba?\((.+)\)/)[1].split(",").map((v) => parseFloat(v));
            this.parseRgbArray(array);
        }

        if (value.startsWith("hsl")) {
            const array = value.match(/hsla?\((.+)\)/)[1].split(",").map((v) => parseFloat(v));
            this.parseHslArray(array);
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

        if (hex.length === 8) {
            this.internal.alpha = parseInt(hex[6] + hex[7], 16) / 255;
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

    get rgbString() {
        return this.getString("rgb");
    }

    get hslString() {
        return this.getString("hsl");
    }

    getString(modelKey: keyof TModels) {
        this.computeModel(modelKey);

        let string = modelKey;
        string += this.internal.alpha < 1 ? "a" : "";
        string += "(";
        string += Object.values(this.internal.models[modelKey].value).map(v => Math.round(v * 255)).join(",");
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

        this.setAlpha(value[3]);
    }

    parseHslArray(value: Array<number>) {
        this.setModel("hsl", {
            h: value[0] / 255,
            s: value[1] / 255,
            l: value[2] / 255
        });

        this.setAlpha(value[3]);
    }

    computeModel(modelKey: keyof TModels) {
        if (this.internal.models[modelKey]?.ready) {
            return;
        }
    }

    setAlpha(alpha: number) {
        if (alpha <= 1) {
            this.internal.alpha = alpha;
            return;
        }

        this.internal.alpha = alpha / 255;
    }
}
