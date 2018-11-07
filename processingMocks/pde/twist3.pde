/* @pjs preload="img/twist01.png"; */
PImage sprite = loadImage("img/twist01.png");

void setup() {
  size(320, 240);
  frameRate(25);
}
void draw() {
  background(0);
  int imageWidth = 320;
  int layerXNum = 10;
  for (int y = 0; y < 15; y++) {
    image(sprite, int((sin(degrees((frameCount + y) / 10)) * (layerXNum / 4)) + layerXNum / 2) * -imageWidth, y * 16);
  }
}