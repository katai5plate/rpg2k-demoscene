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

const parse = script => {
    const fixedScript = script
        .replace(/[\n|\r\n]/g, "") // 改行コード削除
        .replace(/#.*?#/g, "") // コメント削除
        // エスケープ(退避)
        .replace(/\$;/g, "<SC>")
        .replace(/\$,/g, "<CM>")
        .replace(/\$_/g, "<SP>")
        .replace(/\$n/g, "<BR>")
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
                        .replace(/<SC>/g, ";")
                        .replace(/<SP>/g, " ")
                        .replace(/<CM>/g, ",")
                        .replace(/<BR>/g, "\\n")
                    if (!!w.match(/,/)) {
                        _w = w.split(/,/).map(x => x.replace("<CM>", ",")).map(x => x.replace(/<CM>/g, ","));
                    }
                    return _w;
                })
            return _v;
        })
    return fixedScript;
};

const outputDefine = fixedScript => {
    // 変数宣言
    let defineIndex = 0;
    const defineData = fixedScript
        // letを抽出
        .filter(v => v[0] === "let")
        // データをまとめる
        .reduce((p, c) => {
            const _c = c
                .slice(1)
                .map(w => Array.isArray(w) ? w : [w])
            let num = _c[1];
            if (num.length !== 1) syntxErr("不正な代入値", _c, num)
            const vars = _c[0];
            const pushData = vars.reduce((p2, c2) => {
                defineIndex++;
                if (!isNaN(c2)) syntxErr("不正な変数名", c, c2)
                return [
                    ...p2,
                    {
                        var: c2,
                        num: isNaN(num[0]) ? num[0] : Number(num[0]),
                        index: defineIndex,
                    }
                ]
            }, [])
            return [
                ...p,
                ...pushData
            ]
        }, [])
    // カンマによる多重宣言の分配
    const defineConvert = defineData
        .map((v, i) => {
            v.note = `let ${v.var} = ${v.num}`;
            if (isNaN(v.num)) {
                const find = defineData.filter(w => w.var === v.num);
                if (find.length === 0) syntxErr("未宣言の変数は代入不可", v, v.num);
                if (find.length !== 1) syntxErr("変数名の重複宣言", v, v.num);
                // const errFind = defineData.slice(i).filter(w => w.var === v.num);
                // if (errFind.length === 0) syntxErr("未定義の変数", v, v.num);
            }
            return v;
        })
    const defineOutput = defineConvert.map(v => {
        return `${v.var} = ${v.index} : varsel ${v.var} : var 0, 0, ${v.num} ;# ${v.note}`
    })
    return defineOutput
};

const outputMethod = fixedScript => {
    // 変数宣言
    const output = fixedScript
        // 宣言以外を抽出
        .filter(v => v[0] !== "let")
        // データをまとめる
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
                        numS
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
                    return `${args[1]} ${args.slice(2).toString()}`;
                }
                case "cmdv": {
                    let mes = args
                        .slice(3)
                        .toString();
                    if (mes.indexOf("$0") > -1) {
                        syntxErr("$0は使用不可", args, mes);
                    }
                    const reps = mes
                        .match(/\$\d{1}/g)
                        .map(v => v.replace("$", ""))
                    reps.forEach((r) => { mes = mes.replace(`$${r}`, `"+${args[1][r - 1]}+"`) });
                    return `${args[2]} ${mes}`;
                    // return {
                    //     type: "cmd",
                    //     exec: `${args[2]} ${args.slice(3).toString()}`,
                    //     vars: args[1]
                    // }
                }
                // 演算
                default: {
                    const target = [...(Array.isArray(args[0]) ? args[0] : [args[0]])];
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
                    const res = flow.reduce((vv, v) => {
                        const { ope, value } = v;
                        const opeId = "=+-*/%".indexOf(ope);
                        const pushData = target.reduce((p, c) => {
                            return [...p, `varsel ${c} : var ${opeId}, ${isNaN(value) ? 3 : 1}, ${value} ;# ${c} ${ope} ${value}`]
                        }, [])
                        return `${vv === "" ? "" : vv + "\n"}${pushData.join("\n")}`
                    }, "")
                    return res
                };
            }
        })
    return output
};

// --------------------------------------------------

const source = `
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

cmd msg "hello$,$_world!";

# cmd + var #

let n1 114;
let n2 514;
cmdv n1,n2 msg "hello$,$_world!$n\\v[$1]$,\\v[$2]";
`;

const ast = parse(source);

const out = [
    `#include "rpgfunc.as"`,
    "",
    "/* 宣言部 */",
    ...outputDefine(ast),
    "",
    "/* 処理部 */",
    ...outputMethod(ast),
    "",
    "/* テスト */",
    `send 1`,
    `receive 1`,
].join("\n")

console.log(out)
```
