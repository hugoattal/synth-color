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
    it("should work with black", () => {
        const color = new SColor("#000000");
        color.luv.l = 50;
        expect(color.hex).toBe("#777777");
    });
    it("should work with transparency", () => {
        const color = new SColor("hsla(0, 0%, 100%, 80%)");
        expect(color.hex).toBe("#ffffffcc");
    });
    it("should work with no argument", () => {
        const color = new SColor();
        expect(color.hex).toBe("#000000");
    });
    it("should work with rgb arguments", () => {
        const color = new SColor({r: 0.5, g:0.5, b:0.5});
        expect(color.hex).toBe("#808080");
    });
    it("should update rgb via proxy", () => {
        const color = new SColor();
        color.rgb = {r: 0.5, g:0.5, b:0.5};
        expect(color.hex).toBe("#808080");
    });
    it("should update rgb via proxy", () => {
        const color = new SColor();
        color.hsva = {h: 240, s:1, v:1, alpha: 0.5};
        expect(color.hex).toBe("#0000ff80");
    });
    it("should update hex", () => {
        const color = new SColor();
        color.hex = "#ff6600"
        expect(color.hex).toBe("#ff6600");
    });
});
