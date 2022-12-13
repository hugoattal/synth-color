export type TRgbColor = {
    // Red: 0..1
    r: number,
    // Green: 0..1
    g: number,
    // Blue: 0..1
    b: number
}

export type THslColor = {
    // Hue: 0..360
    h: number,
    // Saturation: 0..1
    s: number,
    // Luminosity: 0..1
    l: number
}

export type THsvColor = {
    // Hue: 0..360
    h: number,
    // Saturation: 0..1
    s: number,
    // Value: 0..1
    v: number
}

export type TLabColor = {
    // L*: 0...100 (black..white)
    l: number,
    // a*: -100..100 (green..red)
    a: number,
    // b*: -100..100 (blue..yellow)
    b: number
}

export type TLuvColor = {
    // L*: 0...100 (black..white)
    l: number,
    // u*: -100..100 (green..red)
    u: number,
    // v*: -100..100 (blue..yellow)
    v: number
}

export type TXyzColor = {
    // X: 0..1
    x: number,
    // Y: 0..1
    y: number,
    // Y: 0..1
    z: number
}
