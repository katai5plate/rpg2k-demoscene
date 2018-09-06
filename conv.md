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

varsel 1 : var 0, 0, 123 ;# let x = 123
varsel 2 : var 0, 0, 123 ;# let y = 123
varsel 3 : var 0, 0, 123 ;# let z = 123
varsel 4 : var 0, 0, 0 ;# let a = 0
varsel 5 : var 0, 0, 0 ;# let b = 0
varsel 6 : var 0, 0, 0 ;# let c = 0
varsel 7 : var 0, 0, 0 ;# let d = 0
varsel 8 : var 0, 0, 0 ;# let e = 0
varsel 9 : var 0, 0, 0 ;# let f = 0
varsel 10 : var 0, 0, 0 ;# let g = 0
varsel 11 : var 0, 0, 0 ;# let h = 0
varsel 12 : var 0, 0, 0 ;# let i = 0
varsel 13 : var 0, 0, 0 ;# let j = 0
varsel 14 : var 0, 0, 0 ;# let k = 0
varsel 15 : var 0, 0, 0 ;# let l = 0
varsel 4 ;# a
var 0, 0, 1 ;# = 1
varsel 9 ;# f
var 0, 0, 1 ;# = 1
varsel 14 ;# k
var 0, 0, 1 ;# = 1
varsel 16 : var 0, 0, 0 ;# let rx = 0
varsel 17 : var 0, 0, 0 ;# let ry = 0
varsel 18 : var 0, 0, 0 ;# let rz = 0
varsel 19 : var 0, 0, 0 ;# let t = 0
varsel 19 ;# t
var 0, 1, 1 ;# = x
var 3, 1, 4 ;# * a
varsel 16 ;# rx
var 0, 1, 19 ;# = t
;# 以下略

send
```
### 変換
#### スクリプト
```coffee
let a,b,c,d,e,f,g,h,i,j,k,l 3;
a,f,k = 1;
a + 1 * 4 - k;
```
#### 構文解析
```js
[
  {
    type: "let",
    vars: [
      "a", "b", "c", "d",
      "e", "f", "g", "h",
      "i", "j", "k", "l"
    ],
    numType: "number",
    num: 3
  },
  {
    type: "calc",
    vars: [
      "a", "f", "k"
    ],
    flow: [
      { ope: "=", val: 1 }
    ]
  },
  {
    type: "calc",
    vars: [
      "a"
    ],
    flow: [
      { ope: "+", val: 1 },
      { ope: "*", val: 4 },
      { ope: "-", val: "k" }
    ]
  }
]
```
#### 変数リスト
```js
{
  variables: [
    null,
    "a", "b", "c", "d",
    "e", "f", "g", "h",
    "i", "j", "k", "l"
  ]
}
```
#### コンパイル後
```coffee
#include "rpgfunc.as"

varsel 1 : var 0, 0, 3 ;# let a = 3
varsel 2 : var 0, 0, 3 ;# let b = 3
varsel 3 : var 0, 0, 3 ;# let c = 3
varsel 4 : var 0, 0, 3 ;# let d = 3
varsel 5 : var 0, 0, 3 ;# let e = 3
varsel 6 : var 0, 0, 3 ;# let f = 3
varsel 7 : var 0, 0, 3 ;# let g = 3
varsel 8 : var 0, 0, 3 ;# let h = 3
varsel 9 : var 0, 0, 3 ;# let i = 3
varsel 10 : var 0, 0, 3 ;# let j = 3
varsel 11 : var 0, 0, 3 ;# let k = 3
varsel 12 : var 0, 0, 3 ;# let l = 3

varsel 1 ;# a
var 0, 0, 1 ;# = 1
varsel 6 ;# f
var 0, 0, 1 ;# = 1
varsel 11 ;# k
var 0, 0, 1 ;# = 1

varsel 1 ;# a
var 1, 0, 1 ;# + 1
var 3, 0, 4 ;# * 4
var 2, 1, 11 ;# - k

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
#### JSON化
```js
const syntxErr = (mes, args, point) => {
    console.error(
        `[[ SYNTAX ERROR ]] ${mes}: ${JSON.stringify(args)} -> ${point}`
    );
    process.exit();
}

const eachSlice = (tar, size) => {
    let arr = []
    for (let i = 0, l = tar.length; i < l; i += size) {
        arr.push(tar.slice(i, i + size))
    }
    return arr
};

const isVar = item => ["number", "string"].includes(typeof item);

const analyze = script => JSON.stringify(
    script
        .replace(/[\n|\r\n]/g, "") // 改行コード削除
        .replace(/#.*?#/g, "") // コメント削除
        // エスケープ(退避)
        .replace(/\$;/g, "<SC>")
        .replace(/\$,/g, "<CM>")
        .replace(/\$_/g, "<SP>")
        // スクリプト分割
        .split(/;/)
        .filter(v => v.length !== 0) // 空行削除
        // 配列変換
        .map(v => {
            const _v = v
                .replace(/^\s+/g, "")
                .split(/\s/)
                .map(w => {
                    let _w = w
                        // エスケープ(変換)
                        .replace(/<SC>/g,";")
                        .replace(/<SP>/g," ")
                        .replace(/<CM>/g,",")
                    if (!!w.match(/,/)){
                        _w = w.split(/,/).map(x=>x.replace("<CM>",",")).map(x=>x.replace(/<CM>/g,","));
                    }
                    return _w;
                })
            return _v;
        })
        // 分析
        .map(args => {
            const arg0 = args[0];
            switch (arg0) {
                case "let": {
                    const num = isNaN(args[2]) ? args[2] : Number(args[2]);
                    if (!isVar(num)) {
                        syntxErr("不正な値", args, num);
                    }
                    return {
                        type: "let",
                        vars: [...args[1]],
                        numType: typeof (num),
                        num,
                    }
                };
                // if構文
                case "if": { return { type: arg0 } };
                case "else": { return { type: arg0 } };
                case "endif": { return { type: arg0 } };
                // ループ構文
                case "loop:for": { return { type: arg0 } };
                case "loop:while": { return { type: arg0 } };
                case "loop:repeat": { return { type: arg0 } };
                case "loop:infinity": { return { type: arg0 } };
                case "loop.end": { return { type: arg0 } };
                case "loop.break": { return { type: arg0 } };
                // 命令系
                case "p:show": { return { type: arg0 } };
                case "p:move": { return { type: arg0 } };
                case "p:cls": { return { type: arg0 } };
                // コマンド直接入力
                case "cmd": {
                    return {
                        type: "cmd",
                        exec: `${args[1]} ${args.slice(2).toString()}`,
                        vars: []
                    }
                }
                case "cmdv": {
                    return {
                        type: "cmd",
                        exec: `${args[2]} ${args.slice(3).toString()}`,
                        vars: args[1]
                    }
                }
                // 演算
                default: {
                    const flow = eachSlice(args.slice(1), 2)
                        .map(v => {
                            const [ope, value] = [v[0], v[1]];
                            if (!isVar(value)) {
                                syntxErr("不正な値", args, value);
                            }
                            if (!isNaN(ope) || !"=+-*/%".includes(ope)) {
                                syntxErr("不正な演算子", args, ope);
                            }
                            return {
                                ope, value
                            };
                        })
                    return {
                        type: "calc",
                        vars: [...args[0]],
                        flow
                    }
                };
            }
        })
    , null, "\t"
);

console.log(analyze(`
# memo #

let a,b,c,d,e 3;
let x,y a;
let z 1;

# indent #

a,c,e = 1;
    b + 200;
    b + e;

a + 1 * 4 - c;

# escape -> $ #

cmd msg "hello$,$_world!$";

# cmd + var #

let n1 114;
let n2 514;
cmdv n1,n2 msg "hello$,$_world!$_$1$2";

`))
```
