import { SColor } from "./SColor";
import { expect } from "vitest";

describe("SColor", () => {
    it("should construct the right color", () => {
        expect((new SColor("#ff660055")).hex).toBe("#ff660055");
        expect((new SColor("#ff6600")).hex).toBe("#ff6600");
        expect((new SColor("#ff6600ff")).hex).toBe("#ff6600");
    });
    it("should update the color", () => {
        const color = new SColor("#ff6600");
        color.rgb.r = 0;
        color.rgb.b = 1;
        expect(color.hex).toBe("#0066ff");
    });
    it("should generate the rgb string", () => {
        const color = new SColor("#ff6600");
        expect(color.rgbString).toBe("rgb(255,102,0)");
    });
    it("should generate other models", () => {
        const color = new SColor("#ff6600");
        expect(color.hsv).toStrictEqual({ h: 24, s: 1, v: 1 });
    });
});
