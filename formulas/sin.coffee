# INPUT #
>>> 引数;
let deg 0;
>>> =====;

let res,temp 0;
let mark 1;

if deg < 0;
  deg * -1;
  mark * -1;
if.end;
if deg > 360;
  deg % 360;
if.end;
if deg > 270;
  deg - 360 * -1;
  mark * -1;
if.else;
  if deg > 180;
    deg - 180;
    mark * -1;
  if.else;
    deg - 180 * -1;
  if.end;
if.end;

temp = deg * deg * 64 / 2025;
res = temp * -20 + 12000;
temp * temp / 100;
res + temp * deg / 6750 * mark;

# OUTPUT -> res #
