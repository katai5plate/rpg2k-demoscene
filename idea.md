# インスピレーション
## 変数宣言のオブジェクト管理
```js
Variable = function (name) {
    this.name = name;
    this.val = 0;
    this.setVal = function (v) { this.val = Math.floor(v) };
    this.getVal = function () { return this.val };
}

Vars = function () {
    this.list = [];
    this.define = function (items) {
        if ((typeof items) === "string") items = [items];
        items.forEach(v => {
            this.list.push(new Variable(v));
            console.log(`varsel_var [${v}] : var 0, 0, 0`);
        })
    }
    this.set = function (name, callback) {
        const tar = this.list.filter(v => v.name === name)[0];
        tar.val = callback(tar);
    }
    this.get = function (name) {
        return this.list.filter(v => v.name === name)[0].val;
    }
}

vars = new Vars();

vars.define(["x", "y", "z", "a", "b", "c"]);
console.log(vars);

vars.set("x", v => v.val + 10);

console.log(vars.get("x"));
```

## スクリプト言語
- 基本文法
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
- 変数の四則演算: `<name|names> <=|+=|-=|*=|/=|%=|+|-|*|/|%> <integer|string>;`
  - 演算の連結: `x = con 1 > <=|+=|-=|*=|/=|%=|+|-|*|/|%> <integer|string>;`
    - `>` をつけることで演算対象の変数を引き継いで連続演算が可能
    - HSPの `selvar` に関する工夫

### マトリクス演算
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
selvar 1 : var 0, 0, 3 ;# a
selvar 2 : var 0, 0, 3 ;# b
selvar 3 : var 0, 0, 3 ;# c
selvar 4 : var 0, 0, 3 ;# d
selvar 5 : var 0, 0, 3 ;# e
selvar 6 : var 0, 0, 3 ;# f
selvar 7 : var 0, 0, 3 ;# g
selvar 8 : var 0, 0, 3 ;# h
selvar 9 : var 0, 0, 3 ;# i
selvar 10 : var 0, 0, 3 ;# j
selvar 11 : var 0, 0, 3 ;# k
selvar 12 : var 0, 0, 3 ;# l

selvar 1 : var 0, 0, 1 ;# a
selvar 6 : var 0, 0, 1 ;# f
selvar 11 : var 0, 0, 1 ;# k

selvar 1 ;# a
var 1, 0, 1 ;# + 1
var 3, 0, 4 ;# * 4
var 2, 1, 11 ;# - k
```
