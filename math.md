# 演算に関する技術
## マトリクス変換

||||||||||
|-|-|-|-|-|-|-|-|-|
|a|b|c|d||x|0|0|0|
|e|f|g|h||y|0|0|0|
|i|g|k|l|＊＝|z|0|0|0|
|0|0|0|1||1|0|0|0|

### JS
```js
const { sin, cos, PI } = Math;
const d2r = deg => deg * PI / 180;

const calc = (
    { x = 0, y = 0, z = 0 },
    {
        a = 1, b = 0, c = 0, d = 0,
        e = 0, f = 1, g = 0, h = 0,
        i = 0, j = 0, k = 1, l = 0
    }
) => {
    return {
        x: (a * x) + (b * y) + (c * z) + d,
        y: (e * x) + (f * y) + (g * z) + h,
        z: (i * x) + (j * y) + (k * z) + l,
    }
};
// tansrate = { d: 10, h: 20, l: 30 }
// zoom = { a: 2, f: 2, k: 2 }
// xrot = { f: cos(d2r(30)), g: -sin(d2r(30)), j: sin(d2r(30)), k: cos(d2r(30)) }
```
