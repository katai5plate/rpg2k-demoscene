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
    - 演算の連結: `x = 1 > + 2 > - 3 > * 4 > / 5 > % 6;`
      - `>` をつけることで演算対象の変数を引き継いで連続演算が可能
      - HSPの `selvar` に関する工夫
- 実行時
  - 変数IDの最小値設定: `convert <integer>`

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
t = x > * a; rx = t;
t = y > * b; rx + t;
t = z > * c; rx + t > + d;

t = x > * e; ry = t;
t = y > * f; ry + t;
t = z > * g; ry + t > + h;

t = x > * i; rz = t;
t = y > * j; rz + t;
t = z > * k; rz + t > + l;

# return -> rx,ry,rz #
```
#### AFTER
```coffee
selvar 1 : var 0, 0, 123 ;# let x = 123
selvar 2 : var 0, 0, 123 ;# let y = 123
selvar 3 : var 0, 0, 123 ;# let z = 123
selvar 4 : var 0, 0, 0 ;# let a = 0
selvar 5 : var 0, 0, 0 ;# let b = 0
selvar 6 : var 0, 0, 0 ;# let c = 0
selvar 7 : var 0, 0, 0 ;# let d = 0
selvar 8 : var 0, 0, 0 ;# let e = 0
selvar 9 : var 0, 0, 0 ;# let f = 0
selvar 10 : var 0, 0, 0 ;# let g = 0
selvar 11 : var 0, 0, 0 ;# let h = 0
selvar 12 : var 0, 0, 0 ;# let i = 0
selvar 13 : var 0, 0, 0 ;# let j = 0
selvar 14 : var 0, 0, 0 ;# let k = 0
selvar 15 : var 0, 0, 0 ;# let l = 0
selvar 4 ;# a
var 0, 0, 1 ;# = 1
selvar 9 ;# f
var 0, 0, 1 ;# = 1
selvar 14 ;# k
var 0, 0, 1 ;# = 1
selvar 16 : var 0, 0, 0 ;# let rx = 0
selvar 17 : var 0, 0, 0 ;# let ry = 0
selvar 18 : var 0, 0, 0 ;# let rz = 0
selvar 19 : var 0, 0, 0 ;# let t = 0
selvar 19 ;# t
var 0, 1, 1 ;# = x
var 3, 1, 4 ;# * a
selvar 16 ;# rx
var 0, 1, 19 ;# = t
;# 以下略
```
### 変換
#### スクリプト
```coffee
let a,b,c,d,e,f,g,h,i,j,k,l 3;
a,f,k = 1;
a + 1 > * 4 > - k;
```
#### 変数リスト
```js
{
  variables: [
    null,
    "a", "b", "c", "d",
    "e", "f", "g", "h",
    "i", "j", "k", "l",
  ]
}
```
#### コンパイル後
```coffee
selvar 1 : var 0, 0, 3 ;# let a = 3
selvar 2 : var 0, 0, 3 ;# let b = 3
selvar 3 : var 0, 0, 3 ;# let c = 3
selvar 4 : var 0, 0, 3 ;# let d = 3
selvar 5 : var 0, 0, 3 ;# let e = 3
selvar 6 : var 0, 0, 3 ;# let f = 3
selvar 7 : var 0, 0, 3 ;# let g = 3
selvar 8 : var 0, 0, 3 ;# let h = 3
selvar 9 : var 0, 0, 3 ;# let i = 3
selvar 10 : var 0, 0, 3 ;# let j = 3
selvar 11 : var 0, 0, 3 ;# let k = 3
selvar 12 : var 0, 0, 3 ;# let l = 3

selvar 1 ;# a
var 0, 0, 1 ;# = 1
selvar 6 ;# f
var 0, 0, 1 ;# = 1
selvar 11 ;# k
var 0, 0, 1 ;# = 1

selvar 1 ;# a
var 1, 0, 1 ;# + 1
var 3, 0, 4 ;# * 4
var 2, 1, 11 ;# - k
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
#### インスピレーション
```js
"let a,b,c 10; a,f,k = 2;"
    .replace(/;\s*?(\S)/g,";$1")
    .split(";")
    .map(v=>
        v.split(" ")
            .map(w=>
                w.split(",")
            )
        )
// [
//     [
//         ["let"],["a","b","c"],["10"]
//     ],
//     [
//         ["a","f","k"],["="],["2"]
//     ]
// ]
```
