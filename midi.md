# MIDIに関する技術
## 分解能(Tick)
- 1拍を何分割して譜面を入力しているか（例：960, 480）
- 960の場合、変数6桁では260小節が限界（BPM120の曲が2分ぐらい）
- 960の場合、足音トリガーと同じ処理を`Tick /= 960`の値で比較すればリズム同期可能
## 参考
### アコギ
- https://soundcloud.com/lico_dtm/msgs_guitar_test
  - MIDIあり
### テクニック
- https://www.x68uec.org/files/other/press/2008/text/akima/index.html
- https://trap.jp/post/111/
