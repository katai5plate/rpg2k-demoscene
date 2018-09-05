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
  - 1行にまとめても破綻しないようにするため `;` を末尾につける
- コメントアウト: `# anything #`
- 変数宣言: `let <name|names> <con|var> <number|string>;`
  - 初期値に定数: `let <name|names> con <number>;`
  - 初期値に変数: `let <name|names> var <string>;`
  - これを実行後、`<name|names>`を変数リストに格納
- 変数の四則演算: `<name|names> <=|+|-=|*|/=|%=> <con|var> <number|string>;`
  - 演算の連結: `x = con 1 > <=|+|-=|*|/=|%=> <con|var> <number|string>;`
    - `>` をつけることで演算対象の変数を引き継いで連続演算が可能
    - HSPの `selvar` に関する工夫
  - `+` を `+` と省略して使うこともできる

### マトリクス演算
```coffee
# args-1 #
let x,y,z con 123;

# args-2 #
let a,b,c,d,e,f,g,h,i,j,k,l con 0;
a,f,k = 1;

# returns #
let rx,ry,rz con 0;

# temp #
let t con 0;

# calc #
t = var x > * var a; rx = var t;
t = var y > * var b; rx + var t;
t = var z > * var c; rx + var t > + var d;

t = var x > * var e; ry = var t;
t = var y > * var f; ry + var t;
t = var z > * var g; ry + var t > + var h;

t = var x > * var i; rz = var t;
t = var y > * var j; rz + var t;
t = var z > * var k; rz + var t > + var l;

# return -> rx,ry,rz #
```
