# synth-color

Library for managing and manipulating colors in different color spaces and models.

## Installation

Install `synth-color`:

```
$ pnpm install synth-color
```


## Usage

Create a SColor:

```js
import { SColor } from "synth-color";

const color1 = new SColor("#ff6600");
const color2 = new SColor("#ff660055");
const color3 = new SColor("rgb(255, 128, 0)");
const color4 = new SColor("rgba(255, 128, 0, 50%)");
const color5 = new SColor("hsl(300, 50%, 50%)");
const color6 = new SColor("hsla(300, 50%, 50%, 10%)");
```


Update or get color model of SColors:

```js
color.lab.l = 0.2;
color.hsv.s = 1;

console.log(color.rgb);
console.log(color.hsl);
console.log(color.hsv);
console.log(color.xyz);
console.log(color.lab);
console.log(color.luv);
```


Generate output

```js
console.log(color.hex) // #ff6600
console.log(color.rgbString) // rgb(255,102,0)
console.log(color.hslString) // hsl(24,100%,50%)
```
