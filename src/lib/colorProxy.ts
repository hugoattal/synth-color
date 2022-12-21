import { SColor, TColorInternal, TModels } from "../class/SColor";

const colorMatcher = /^(rgb|lab|hsl|hsv|luv|xyz)(a?)$/;

export function getColorProxy(target: SColor, internal: TColorInternal) {
    return new Proxy(target, {
        get(target: SColor, property: string): any {
            const colorMatch = property.match(colorMatcher);
            if (colorMatch) {
                const model = colorMatch[1] as keyof TModels;
                const alpha = colorMatch[2];

                target.computeModel(model);
                const output: Record<string, number> = internal.models[colorMatch[1]].value;
                if (alpha) {
                    output.alpha = internal.alpha;
                }

                return getModelProxy(target, output, internal, { modelKey: model, alpha });
            }

            if (property === "alpha") {
                return internal.alpha;
            }

            return target[property];
        },
        set(target: SColor, property: string, value: unknown): boolean {
            if (property === "alpha") {
                target.setAlpha(value as number);
                return true;
            }

            if (property === "hex") {
                target.parseHex(value as string);
                return true;
            }

            const colorMatch = property.match(colorMatcher);
            if (colorMatch) {
                const model = colorMatch[1] as keyof TModels;
                const alpha = colorMatch[2];

                target.setModel(model, value as any);
                target.updateModel(model);

                if (alpha) {
                    target.setAlpha((value as { a: number }).a);
                }

                return true;
            }

            return false;
        }
    });
}

export function getModelProxy(color: SColor, target: Record<string, number>, internal: TColorInternal, {
    modelKey,
    alpha
}: { modelKey: keyof TModels, alpha: string }) {
    return new Proxy(target, {
        set(target: Record<string, number>, property: string, value: number): boolean {
            if (property === "alpha") {
                internal.alpha = value;
                return true;
            }

            if (property.length === 1 && modelKey.includes(property)) {
                color.computeModel(modelKey);
                internal.models[modelKey].value[property] = value;
                color.updateModel(modelKey);
                return true;
            }

            return false;
        }
    });
}
