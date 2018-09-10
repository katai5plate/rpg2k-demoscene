# コンパイルに関する技術

## アーキテクチャ
1. 独自スクリプト言語でアルゴリズムを記述
2. HSPの相互変換モジュール対応ソースコードにコンパイル出力
3. HSPからクリップボードにコピー
4. ツクールに貼り付け

### サンプル：マトリクス演算(行列の乗算)
#### BEFORE: スクリプト記述 (20行)
```coffee
# VARIABLE DECLATION #
# input / output #
let x,y,z 0 in vector;
let a,b,c,d,e,f,g,h,i,j,k,l 0 in multiplication matrix;
let rx,ry,rz 0 out result vector;
# private #
let t 0;
# CALCULATION #
>>> x;
t = x * a; rx = t;
t = y * b; rx + t;
t = z * c; rx + t + d;
>>> y;
t = x * e; ry = t;
t = y * f; ry + t;
t = z * g; ry + t + h;
>>> z;
t = x * i; rz = t;
t = y * j; rz + t;
t = z * k; rz + t + l;
```
#### AFTER: コンパイル後 (84行)
- `rpgfunc.as` がインクルードされたHSPファイルが生成される。
- ある程度編集しやすいよう、コメントによりスクリプトの一部の処理内容が残されている。
```coffee
#include "rpgfunc.as"

/* DECLARATION */
rem "INPUT: x 1 vector" : x = 1 // : varsel x : var 0, 0, 0 ;# let x = 0

rem "INPUT: y 2 vector" : y = 2 // : varsel y : var 0, 0, 0 ;# let y = 0

rem "INPUT: z 3 vector" : z = 3 // : varsel z : var 0, 0, 0 ;# let z = 0

rem "INPUT: a 4 multiplication matrix" : a = 4 // : varsel a : var 0, 0, 0 ;# let a = 0

rem "INPUT: b 5 multiplication matrix" : b = 5 // : varsel b : var 0, 0, 0 ;# let b = 0

rem "INPUT: c 6 multiplication matrix" : c = 6 // : varsel c : var 0, 0, 0 ;# let c = 0

rem "INPUT: d 7 multiplication matrix" : d = 7 // : varsel d : var 0, 0, 0 ;# let d = 0

rem "INPUT: e 8 multiplication matrix" : e = 8 // : varsel e : var 0, 0, 0 ;# let e = 0

rem "INPUT: f 9 multiplication matrix" : f = 9 // : varsel f : var 0, 0, 0 ;# let f = 0

rem "INPUT: g 10 multiplication matrix" : g = 10 // : varsel g : var 0, 0, 0 ;# let g = 0

rem "INPUT: h 11 multiplication matrix" : h = 11 // : varsel h : var 0, 0, 0 ;# let h = 0

rem "INPUT: i 12 multiplication matrix" : i = 12 // : varsel i : var 0, 0, 0 ;# let i = 0

rem "INPUT: j 13 multiplication matrix" : j = 13 // : varsel j : var 0, 0, 0 ;# let j = 0

rem "INPUT: k 14 multiplication matrix" : k = 14 // : varsel k : var 0, 0, 0 ;# let k = 0

rem "INPUT: l 15 multiplication matrix" : l = 15 // : varsel l : var 0, 0, 0 ;# let l = 0

rem "OUTPUT: rx 16 result vector" : rx = 16 : varsel rx : var 0, 0, 0 ;# let rx = 0
rem "-----"
rem "OUTPUT: ry 17 result vector" : ry = 17 : varsel ry : var 0, 0, 0 ;# let ry = 0
rem "-----"
rem "OUTPUT: rz 18 result vector" : rz = 18 : varsel rz : var 0, 0, 0 ;# let rz = 0
rem "-----"
t = 19 : varsel t : var 0, 0, 0 ;# let t = 0

rem "====="

/* PROCESSING */
rem "x"
varsel t : var 0, 1, x ;# t = x
varsel t : var 3, 1, a ;# t * a
varsel rx : var 0, 1, t ;# rx = t
varsel t : var 0, 1, y ;# t = y
varsel t : var 3, 1, b ;# t * b
varsel rx : var 1, 1, t ;# rx + t
varsel t : var 0, 1, z ;# t = z
varsel t : var 3, 1, c ;# t * c
varsel rx : var 1, 1, t ;# rx + t
varsel rx : var 1, 1, d ;# rx + d
rem "y"
varsel t : var 0, 1, x ;# t = x
varsel t : var 3, 1, e ;# t * e
varsel ry : var 0, 1, t ;# ry = t
varsel t : var 0, 1, y ;# t = y
varsel t : var 3, 1, f ;# t * f
varsel ry : var 1, 1, t ;# ry + t
varsel t : var 0, 1, z ;# t = z
varsel t : var 3, 1, g ;# t * g
varsel ry : var 1, 1, t ;# ry + t
varsel ry : var 1, 1, h ;# ry + h
rem "z"
varsel t : var 0, 1, x ;# t = x
varsel t : var 3, 1, i ;# t * i
varsel rz : var 0, 1, t ;# rz = t
varsel t : var 0, 1, y ;# t = y
varsel t : var 3, 1, j ;# t * j
varsel rz : var 1, 1, t ;# rz + t
varsel t : var 0, 1, z ;# t = z
varsel t : var 3, 1, k ;# t * k
varsel rz : var 1, 1, t ;# rz + t
varsel rz : var 1, 1, l ;# rz + l

/* TESTING */
; send 1
; receive 1

/* SUBMIT */
send
```
#### FINALLY: 相互変換モジュールによる変換 (60行)
- 無駄が完全に排除され、可読性が限りなく低くなる
```coffee
rem "INPUT: x 1 vector"
rem "INPUT: y 2 vector"
rem "INPUT: z 3 vector"
rem "INPUT: a 4 multiplication matrix"
rem "INPUT: b 5 multiplication matrix"
rem "INPUT: c 6 multiplication matrix"
rem "INPUT: d 7 multiplication matrix"
rem "INPUT: e 8 multiplication matrix"
rem "INPUT: f 9 multiplication matrix"
rem "INPUT: g 10 multiplication matrix"
rem "INPUT: h 11 multiplication matrix"
rem "INPUT: i 12 multiplication matrix"
rem "INPUT: j 13 multiplication matrix"
rem "INPUT: k 14 multiplication matrix"
rem "INPUT: l 15 multiplication matrix"
rem "OUTPUT: rx 16 result vector"
varsel 16 : var 0, 0, 0, 0
rem "-----"
rem "OUTPUT: ry 17 result vector"
varsel 17 : var 0, 0, 0, 0
rem "-----"
rem "OUTPUT: rz 18 result vector"
varsel 18 : var 0, 0, 0, 0
rem "-----"
varsel 19 : var 0, 0, 0, 0
rem "====="
rem "x"
varsel 19 : var 0, 1, 1, 0
varsel 19 : var 3, 1, 4, 0
varsel 16 : var 0, 1, 19, 0
varsel 19 : var 0, 1, 2, 0
varsel 19 : var 3, 1, 5, 0
varsel 16 : var 1, 1, 19, 0
varsel 19 : var 0, 1, 3, 0
varsel 19 : var 3, 1, 6, 0
varsel 16 : var 1, 1, 19, 0
varsel 16 : var 1, 1, 7, 0
rem "y"
varsel 19 : var 0, 1, 1, 0
varsel 19 : var 3, 1, 8, 0
varsel 17 : var 0, 1, 19, 0
varsel 19 : var 0, 1, 2, 0
varsel 19 : var 3, 1, 9, 0
varsel 17 : var 1, 1, 19, 0
varsel 19 : var 0, 1, 3, 0
varsel 19 : var 3, 1, 10, 0
varsel 17 : var 1, 1, 19, 0
varsel 17 : var 1, 1, 11, 0
rem "z"
varsel 19 : var 0, 1, 1, 0
varsel 19 : var 3, 1, 12, 0
varsel 18 : var 0, 1, 19, 0
varsel 19 : var 0, 1, 2, 0
varsel 19 : var 3, 1, 13, 0
varsel 18 : var 1, 1, 19, 0
varsel 19 : var 0, 1, 3, 0
varsel 19 : var 3, 1, 14, 0
varsel 18 : var 1, 1, 19, 0
varsel 18 : var 1, 1, 15, 0
send
```
### サンプル：短いスクリプト
#### BEFORE: スクリプト記述 (3行)
```coffee
let a,b,c,d,e,f,g,h,i,j,k,l 3;
a,f,k = 1;
a + 1 * 4 - k;
```
#### AFTER: コンパイル後 (32行)
```coffee
#include "rpgfunc.as"

/* DECLARATION */
a = 1 : varsel a : var 0, 0, 3 ;# let a = 3
b = 2 : varsel b : var 0, 0, 3 ;# let b = 3
c = 3 : varsel c : var 0, 0, 3 ;# let c = 3
d = 4 : varsel d : var 0, 0, 3 ;# let d = 3
e = 5 : varsel e : var 0, 0, 3 ;# let e = 3
f = 6 : varsel f : var 0, 0, 3 ;# let f = 3
g = 7 : varsel g : var 0, 0, 3 ;# let g = 3
h = 8 : varsel h : var 0, 0, 3 ;# let h = 3
i = 9 : varsel i : var 0, 0, 3 ;# let i = 3
j = 10 : varsel j : var 0, 0, 3 ;# let j = 3
k = 11 : varsel k : var 0, 0, 3 ;# let k = 3
l = 12 : varsel l : var 0, 0, 3 ;# let l = 3

rem "====="

/* PROCESSING */
varsel a : var 0, 0, 1 ;# a = 1
varsel f : var 0, 0, 1 ;# f = 1
varsel k : var 0, 0, 1 ;# k = 1
varsel a : var 1, 0, 1 ;# a + 1
varsel a : var 3, 0, 4 ;# a * 4
varsel a : var 2, 1, k ;# a - k

/* TESTING */
; send 1
; receive 1

/* SUBMIT */
send
```
#### FINALLY: 相互変換モジュールによる変換 (20行)
```coffee
varsel 1 : var 0, 0, 3, 0
varsel 2 : var 0, 0, 3, 0
varsel 3 : var 0, 0, 3, 0
varsel 4 : var 0, 0, 3, 0
varsel 5 : var 0, 0, 3, 0
varsel 6 : var 0, 0, 3, 0
varsel 7 : var 0, 0, 3, 0
varsel 8 : var 0, 0, 3, 0
varsel 9 : var 0, 0, 3, 0
varsel 10 : var 0, 0, 3, 0
varsel 11 : var 0, 0, 3, 0
varsel 12 : var 0, 0, 3, 0
rem "====="
varsel 1 : var 0, 0, 1, 0
varsel 6 : var 0, 0, 1, 0
varsel 11 : var 0, 0, 1, 0
varsel 1 : var 1, 0, 1, 0
varsel 1 : var 3, 0, 4, 0
varsel 1 : var 2, 1, 11, 0
send
```

# コンパイラー
- [compiler/build.js](https://github.com/katai5plate/rpg2k-demoscene/blob/master/compiler/build.js)

## スクリプト言語草案
- [実際の仕様はこちらを参照](script.md)
- 基本文法
  - 構文
    - スペース区切りで次の引数へ
    - `<name|names>` だけは `,` 区切りで複数選択を許可
    - `<integer|string>` は整数か文字列かで定数か変数かを判定する
      - 実数は構文エラーとする
    - 1行にまとめても破綻しないようにするため `;` を末尾につける
  - コメントアウト: `# anything #`
  - 変数宣言: `let <name|names> <integer|string>;`
    - 初期値に定数: `let <name|names> <integer>;`
    - 初期値に変数: `let <name|names> <string>;`
    - これを実行後、`<name|names>`を変数リストに格納
  - 変数の四則演算: `<name|names> <=|+|-|*|/|%> <integer|string>;`
    - 演算の連結: `x = 1 + 2 - 3 * 4 / 5 % 6;`
      - `<=|+|-|*|/|%> <integer|string>` を繰り返すことで演算対象の変数を引き継いで連続演算が可能
      - HSPの `varsel` に関する工夫
- 実行時オプション
  - 変数IDの最小値
  - 宣言時の代入値が `0` のとき記述を省略するか
  
### 構文解析草案
- まず１行にする
  - 余分な空白文字(スペース・改行・タブ)を消す
  - スペースとスペースの間や `;` とスペースの間に改行を残さない
  - `;` の後に空白を開けない
  - `#～#` を消す
- `;` で区切る
- スペースで区切る
- `,` で区切る
