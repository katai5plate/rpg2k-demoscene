# 演算に関する技術
## マトリクス変換

|_A_|.|.|.|:|_B_|.|.|.|
|-|-|-|-|-|-|-|-|-|
|**a**|b|c|d||**x**|0|0|0|
|e|**f**|g|h||**y**|0|0|0|
|i|g|**k**|l|X|**z**|0|0|0|
|0|0|0|**1**||**1**|0|0|0|

### 移動と拡縮
|_M_|.|.|.||_Z_|.|.|.|
|-|-|-|-|-|-|-|-|-|
|1|||x|:|x||||
||1||y|:||y|||
|||1|z|:|||z||
||||1|:||||1|

### 回転
|_X_|.|.|.||_Y_|.|.|.||_Z_|.|.|.|
|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|1||||:|cosθ||sinθ||:|cosθ|-sinθ|||
||cosθ|-sinθ||:||1|||:|sinθ|cosθ|||
||sinθ|cosθ||:|-sinθ||cosθ||:|||1||
||||1|:||||1|:||||1|:||||1|

### JS
```js
const { sin, cos, PI } = Math;
// const d2r = deg => deg * PI / 180;
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
```
### RPG2K
```php
#define OPE_EQU 0
#define OPE_ADD 1
#define OPE_MUL 3

#define TAR_CON 0
#define TAR_VAL 1

#define VAR_X 1
#define VAR_Y 2
#define VAR_Z 3
#define VAR_A 4
#define VAR_B 5
#define VAR_C 6
#define VAR_D 7
#define VAR_E 8
#define VAR_F 9
#define VAR_G 10
#define VAR_H 11
#define VAR_I 12
#define VAR_J 13
#define VAR_K 14
#define VAR_L 15

#define VAR_TM 16

#define VAR_RX 17
#define VAR_RY 18
#define VAR_RZ 19

varsel_var VAR_X : var OPE_EQU, TAR_CON, 0
varsel_var VAR_Y : var OPE_EQU, TAR_CON, 0
varsel_var VAR_Z : var OPE_EQU, TAR_CON, 0

varsel_var VAR_A : var OPE_EQU, TAR_CON, 1
varsel_var VAR_B : var OPE_EQU, TAR_CON, 0
varsel_var VAR_C : var OPE_EQU, TAR_CON, 0
varsel_var VAR_D : var OPE_EQU, TAR_CON, 0
varsel_var VAR_E : var OPE_EQU, TAR_CON, 0
varsel_var VAR_F : var OPE_EQU, TAR_CON, 1
varsel_var VAR_G : var OPE_EQU, TAR_CON, 0
varsel_var VAR_H : var OPE_EQU, TAR_CON, 0
varsel_var VAR_I : var OPE_EQU, TAR_CON, 0
varsel_var VAR_J : var OPE_EQU, TAR_CON, 0
varsel_var VAR_K : var OPE_EQU, TAR_CON, 1
varsel_var VAR_L : var OPE_EQU, TAR_CON, 0

varsel_var VAR_TM : var OPE_EQU, TAR_VAL, VAR_X : var OPE_MUL, TAR_VAL, VAR_A
varsel_var VAR_RX : var OPE_EQU, TAR_VAL, VAR_TM
varsel_var VAR_TM : var OPE_EQU, TAR_VAL, VAR_Y : var OPE_MUL, TAR_VAL, VAR_B
varsel_var VAR_RX : var OPE_ADD, TAR_VAL, VAR_TM
varsel_var VAR_TM : var OPE_EQU, TAR_VAL, VAR_Z : var OPE_MUL, TAR_VAL, VAR_C
varsel_var VAR_RX : var OPE_ADD, TAR_VAL, VAR_TM
varsel_var VAR_RX : var OPE_ADD, TAR_VAL, VAR_D

varsel_var VAR_TM : var OPE_EQU, TAR_VAL, VAR_X : var OPE_MUL, TAR_VAL, VAR_E
varsel_var VAR_RY : var OPE_EQU, TAR_VAL, VAR_TM
varsel_var VAR_TM : var OPE_EQU, TAR_VAL, VAR_Y : var OPE_MUL, TAR_VAL, VAR_F
varsel_var VAR_RY : var OPE_ADD, TAR_VAL, VAR_TM
varsel_var VAR_TM : var OPE_EQU, TAR_VAL, VAR_Z : var OPE_MUL, TAR_VAL, VAR_G
varsel_var VAR_RY : var OPE_ADD, TAR_VAL, VAR_TM
varsel_var VAR_RY : var OPE_ADD, TAR_VAL, VAR_H

varsel_var VAR_TM : var OPE_EQU, TAR_VAL, VAR_X : var OPE_MUL, TAR_VAL, VAR_I
varsel_var VAR_RZ : var OPE_EQU, TAR_VAL, VAR_TM
varsel_var VAR_TM : var OPE_EQU, TAR_VAL, VAR_Y : var OPE_MUL, TAR_VAL, VAR_J
varsel_var VAR_RZ : var OPE_ADD, TAR_VAL, VAR_TM
varsel_var VAR_TM : var OPE_EQU, TAR_VAL, VAR_Z : var OPE_MUL, TAR_VAL, VAR_K
varsel_var VAR_RZ : var OPE_ADD, TAR_VAL, VAR_TM
varsel_var VAR_RZ : var OPE_ADD, TAR_VAL, VAR_L
```



























