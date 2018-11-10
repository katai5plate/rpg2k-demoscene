const canvas = document.getElementById("player");
const context = canvas.getContext("2d");

let fc = 0;

/**
 * Pictureの前提
 * - 「ピクチャの移動」は瞬間移動（ウェイト:0）しか使わない
 * - 拡大率・透明度は「ピクチャの表示」でのみ変更できることにする
 * - 色調変更・回転・波長は使わない
 */

const picture = {
  data: [],
  picData: ()=>({
    id: 0,
    image: new Image(),
    x: 0,
    y: 0,
    s: 100,
    a: 0,
  }),
  show(id, name, x, y) {
    this.data[id] = {
      ...this.picData()
    };
    this.data[id].image.src = `img/${name}.png`;
    this.data[id].x = x;
    this.data[id].y = y;
  },
  move(id, x, y) {
    if (this.data[id]) {
      this.data[id].x = x;
      this.data[id].y = y;
    }
  },
  update() {
    this.data.map(v => {
      if (v) {
        context.drawImage(v.image, v.x, v.y, v.image.width, v.image.height);
      }
    })
  },
};

const update = () => {
  const _fillStyle = context.fillStyle;
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = _fillStyle;
  draw();
  picture.update();
  fc++;
}

setup();
setInterval(update, 1);