const __VARS_START = 100;

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
    let defineIndex = __VARS_START || 0;
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
                case "if": {
                    let [target, ope, than] = args.slice(1);
                    const thanIsCon = !isVar(than) ? -1 : isNaN(than) ? 0 : 1;
                    if (thanIsCon===-1) {
                        syntxErr("不正な値", args, than);
                    }
                    const opeId = ["=",">=","<=",">","<","!"].indexOf(ope);
                    return `co 1, ${target}, ${thanIsCon}, ${than}, ${opeId}`;
                };
                case "if.else": { return "coelse" };
                case "if.end": { return "coend" };
                // ループ構文
                case "loop": { return "cy" };
                case "loop.for": {
                    // まだ
                    return "cy";
                    /*
                    varsel count : var 0, 0, INIT
                    cy
                        varsel count : var 1, (C/V), ADD
                        co 1, count, (V&C/V&V), (C/V), OPE
                            cybreak
                        coend
                        =====
                        =====
                    cyend
                     */
                    const [counter, init, ope, than, add] = args.slice(1);
                    return `varsel ${counter} : var 0, 0, ${init} : cy : varsel ${counter} : var 1, (C/V), ${add} : co 1, ${counter}, (V&C/V&V), /*(C/V)*/:${than}, ${ope} : cybreak : coend`
                };
                case "loop.while": { return { type: arg0 } };
                case "loop.repeat": { return { type: arg0 } };
                case "loop.end": { return "cyend" };
                case "loop.break": { return "cybreak" };
                // 命令系
                case "pic.show": { return { type: arg0 } };
                case "pic.move": { return { type: arg0 } };
                case "pic.cls": { return { type: arg0 } };
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
