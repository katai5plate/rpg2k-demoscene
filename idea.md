# インスピレーション
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
