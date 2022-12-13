export const SMath = {
    clamp: (value: number, min: number, max: number) => {
        if (value > max) {
            return max;
        }
        if (value < min) {
            return min;
        }
        return value;
    },

    lerp: (a: number, b: number, alpha: number) => {
        return b * alpha + a * (1 - alpha);
    },

    level: (value: number, target: number, alpha: number) => {
        return value + (target - value) * alpha;
    }
};
