# RPG2000 Demoscene
- ツクール2000でメガデモを作るためのメモとか資料とかコンパイラーとか

# メモ記事リンク
- [演算](math.md)
- [音楽](midi.md)
- [演出](effect.md)
- [コンパイル](conv.md)
  - [スクリプト言語仕様](script.md)
- []()

# コンパイラーの使い方
0. PCに以下をインストール
- Node.js
- yarn
- git
- [Hot Soup Processor](http://hsp.tv/idman/download.html)
- [RPGツクール200X イベント命令のスクリプト化モジュール](http://www.geocities.jp/orreiclan/content/work/work.html?file=rpgfunc_1_02&type=hsp)
- RPGツクール2000 または 2003

1. コマンドプロンプトを開く

2. コマンド入力でインストール
```shell
cd <インストールしたいディレクトリ>
git clone https://github.com/katai5plate/rpg2k-demoscene/
cd rpg2k-demoscene
yarn install
```

3. 実行
```
yarn build <スクリプトのファイルパス> <?使い始める変数IDのマイナス１>
```
例（circle.coffeeを変数101スタートでコンパイル）：
```
yarn build formula/circle.coffee 100
```

4. distディレクトリにHSPファイルが作られるので開く

5. 実行するとクリップボードに生成されたイベントコマンドがコピーされる

6. RPGツクール2000のコマンドエディタにペーストする
