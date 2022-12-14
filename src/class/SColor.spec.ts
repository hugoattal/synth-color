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
        const color = new SColor("hsl(300, 50%, 50%)");
        expect(color.hex).toBe("#bf40bf");
    });
    it("should update alpha", () => {
        const color = new SColor("hsl(230, 50%, 50%)");
        expect(color.hex).toBe("#4055bf");
        color.alpha = 0.5;
        expect(color.hex).toBe("#4055bf80");
    });
    it("test", () => {
        const color = new SColor("hsl(230, 0%, 50%)");
        color.luv.l = 53;
        //console.log(color.hex);
        const color2 = new SColor("hsl(60, 100%, 50%)");
        console.log(color2.hex);
        color2.luv.l = 50;
        console.log(color2.hex);
        const color3 = new SColor("hsl(230, 100%, 50%)");
        color3.luv.l = 53;
        //console.log(color3.hex);
    });
});
