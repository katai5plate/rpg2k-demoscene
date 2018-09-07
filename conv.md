# コンパイルに関する技術

## アーキテクチャ
1. 独自スクリプト言語でアルゴリズムを記述
2. HSPのRPG2K相互変換ソースコードにコンパイル
3. HSPからクリップボードにコピー
4. ツクールに貼り付け

## アイデア
### 変数を自動配置
- JSコードでは変数を文字列管理し、コンパイル時に変数を再配置
### 定型文を一発入力
- マトリクス変換
- 三角関数
- Tick同期処理

## 独自スクリプト言語
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

### マトリクス演算
#### BEFORE
```coffee
# args-1 #
let x,y,z 123;

# args-2 #
let a,b,c,d,e,f,g,h,i,j,k,l 0;
a,f,k = 1;

# returns #
let rx,ry,rz 0;

# temp #
let t 0;

# calc #
t = x * a; rx = t;
t = y * b; rx + t;
t = z * c; rx + t + d;

t = x * e; ry = t;
t = y * f; ry + t;
t = z * g; ry + t + h;

t = x * i; rz = t;
t = y * j; rz + t;
t = z * k; rz + t + l;

# return -> rx,ry,rz #
```
#### AFTER
```coffee
#include "rpgfunc.as"

x = 1 : varsel x : var 0, 0, 123 ;# let x = 123
y = 2 : varsel y : var 0, 0, 123 ;# let y = 123
z = 3 : varsel z : var 0, 0, 123 ;# let z = 123
a = 4 : varsel a : var 0, 0, 0 ;# let a = 0
b = 5 : varsel b : var 0, 0, 0 ;# let b = 0
c = 6 : varsel c : var 0, 0, 0 ;# let c = 0
d = 7 : varsel d : var 0, 0, 0 ;# let d = 0
e = 8 : varsel e : var 0, 0, 0 ;# let e = 0
f = 9 : varsel f : var 0, 0, 0 ;# let f = 0
g = 10 : varsel g : var 0, 0, 0 ;# let g = 0
h = 11 : varsel h : var 0, 0, 0 ;# let h = 0
i = 12 : varsel i : var 0, 0, 0 ;# let i = 0
j = 13 : varsel j : var 0, 0, 0 ;# let j = 0
k = 14 : varsel k : var 0, 0, 0 ;# let k = 0
l = 15 : varsel l : var 0, 0, 0 ;# let l = 0
rx = 16 : varsel rx : var 0, 0, 0 ;# let rx = 0
ry = 17 : varsel ry : var 0, 0, 0 ;# let ry = 0
rz = 18 : varsel rz : var 0, 0, 0 ;# let rz = 0
t = 19 : varsel t : var 0, 0, 0 ;# let t = 0

varsel a : var 0, 1, 1 ;# a = 1
varsel f : var 0, 1, 1 ;# f = 1
varsel k : var 0, 1, 1 ;# k = 1
varsel t : var 0, 3, x ;# t = x
varsel t : var 3, 3, a ;# t * a
varsel rx : var 0, 3, t ;# rx = t
varsel t : var 0, 3, y ;# t = y
varsel t : var 3, 3, b ;# t * b
varsel rx : var 1, 3, t ;# rx + t
varsel t : var 0, 3, z ;# t = z
varsel t : var 3, 3, c ;# t * c
varsel rx : var 1, 3, t ;# rx + t
varsel rx : var 1, 3, d ;# rx + d
varsel t : var 0, 3, x ;# t = x
varsel t : var 3, 3, e ;# t * e
varsel ry : var 0, 3, t ;# ry = t
varsel t : var 0, 3, y ;# t = y
varsel t : var 3, 3, f ;# t * f
varsel ry : var 1, 3, t ;# ry + t
varsel t : var 0, 3, z ;# t = z
varsel t : var 3, 3, g ;# t * g
varsel ry : var 1, 3, t ;# ry + t
varsel ry : var 1, 3, h ;# ry + h
varsel t : var 0, 3, x ;# t = x
varsel t : var 3, 3, i ;# t * i
varsel rz : var 0, 3, t ;# rz = t
varsel t : var 0, 3, y ;# t = y
varsel t : var 3, 3, j ;# t * j
varsel rz : var 1, 3, t ;# rz + t
varsel t : var 0, 3, z ;# t = z
varsel t : var 3, 3, k ;# t * k
varsel rz : var 1, 3, t ;# rz + t
varsel rz : var 1, 3, l ;# rz + l

send
```
#### FINALLY
```coffee
varsel 1 : var 0, 0, 123, 0
varsel 2 : var 0, 0, 123, 0
varsel 3 : var 0, 0, 123, 0
varsel 4 : var 0, 0, 0, 0
varsel 5 : var 0, 0, 0, 0
varsel 6 : var 0, 0, 0, 0
varsel 7 : var 0, 0, 0, 0
varsel 8 : var 0, 0, 0, 0
varsel 9 : var 0, 0, 0, 0
varsel 10 : var 0, 0, 0, 0
varsel 11 : var 0, 0, 0, 0
varsel 12 : var 0, 0, 0, 0
varsel 13 : var 0, 0, 0, 0
varsel 14 : var 0, 0, 0, 0
varsel 15 : var 0, 0, 0, 0
varsel 16 : var 0, 0, 0, 0
varsel 17 : var 0, 0, 0, 0
varsel 18 : var 0, 0, 0, 0
varsel 19 : var 0, 0, 0, 0
varsel 4 : var 0, 1, 1, 0
varsel 9 : var 0, 1, 1, 0
varsel 14 : var 0, 1, 1, 0
varsel 19 : var 0, 3, 1, 0
varsel 19 : var 3, 3, 4, 0
varsel 16 : var 0, 3, 19, 0
varsel 19 : var 0, 3, 2, 0
varsel 19 : var 3, 3, 5, 0
varsel 16 : var 1, 3, 19, 0
varsel 19 : var 0, 3, 3, 0
varsel 19 : var 3, 3, 6, 0
varsel 16 : var 1, 3, 19, 0
varsel 16 : var 1, 3, 7, 0
varsel 19 : var 0, 3, 1, 0
varsel 19 : var 3, 3, 8, 0
varsel 17 : var 0, 3, 19, 0
varsel 19 : var 0, 3, 2, 0
varsel 19 : var 3, 3, 9, 0
varsel 17 : var 1, 3, 19, 0
varsel 19 : var 0, 3, 3, 0
varsel 19 : var 3, 3, 10, 0
varsel 17 : var 1, 3, 19, 0
varsel 17 : var 1, 3, 11, 0
varsel 19 : var 0, 3, 1, 0
varsel 19 : var 3, 3, 12, 0
varsel 18 : var 0, 3, 19, 0
varsel 19 : var 0, 3, 2, 0
varsel 19 : var 3, 3, 13, 0
varsel 18 : var 1, 3, 19, 0
varsel 19 : var 0, 3, 3, 0
varsel 19 : var 3, 3, 14, 0
varsel 18 : var 1, 3, 19, 0
varsel 18 : var 1, 3, 15, 0
send
```
### 変換
#### スクリプト
```coffee
let a,b,c,d,e,f,g,h,i,j,k,l 3;
a,f,k = 1;
a + 1 * 4 - k;
```
#### コンパイル後
```coffee
#include "rpgfunc.as"

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

varsel a : var 0, 1, 1 ;# a = 1
varsel f : var 0, 1, 1 ;# f = 1
varsel k : var 0, 1, 1 ;# k = 1
varsel a : var 1, 1, 1 ;# a + 1
varsel a : var 3, 1, 4 ;# a * 4
varsel a : var 2, 3, k ;# a - k

send
```
#### モジュールにより最適化
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
varsel 1 : var 0, 1, 1, 0
varsel 6 : var 0, 1, 1, 0
varsel 11 : var 0, 1, 1, 0
varsel 1 : var 1, 1, 1, 0
varsel 1 : var 3, 1, 4, 0
varsel 1 : var 2, 3, 11, 0
send
```

### 構文解析
- まず１行にする
  - 余分な空白文字(スペース・改行・タブ)を消す
  - スペースとスペースの間や `;` とスペースの間に改行を残さない
  - `;` の後に空白を開けない
  - `#～#` を消す
- `;` で区切る
- スペースで区切る
- `,` で区切る
#### コンパイラー
- [compiler/build.js](https://github.com/katai5plate/rpg2k-demoscene/blob/master/compiler/build.js)
