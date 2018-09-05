# 演算に関する技術
## マトリクス変換

|_A_|.|.|.||_B_|.|.|.|
|-|-|-|-|-|-|-|-|-|
|**a**|b|c|d||**x**|0|0|0|
|e|**f**|g|h||**y**|0|0|0|
|i|g|**k**|l|X|**z**|0|0|0|
|0|0|0|**1**||**1**|0|0|0|

### 移動
|_A_|.|.|.|
|-|-|-|-|
|1|||x|
||1||y|
|||1|z|
||||1|

### 拡縮
|_A_|.|.|.|
|-|-|-|-|
|x||||
||y|||
|||z||
||||1|

### 回転
#### X軸
|_A_|.|.|.|
|-|-|-|-|
|1||||
||cosθ|-sinθ||
||sinθ|cosθ||
||||1|

#### Y軸
|_A_|.|.|.|
|-|-|-|-|
|cosθ||sinθ||
||1|||
|-sinθ||cosθ||
||||1|

#### Z軸
|_A_|.|.|.|
|-|-|-|-|
|cosθ|-sinθ|||
|sinθ|cosθ|||
|||1||
||||1|

### JS
```js
const { sin, cos, PI } = Math;
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
// const d2r = deg => deg * PI / 180;
// xrot = { f: cos(d2r(30)), g: -sin(d2r(30)), j: sin(d2r(30)), k: cos(d2r(30)) }
```