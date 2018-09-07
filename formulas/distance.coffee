# INPUT #
>>> 引数;
let x1,y1,x2,y2 0;
>>> =====;

let arg,temp,res,pre,pref 0;

arg = x1 - x2 * arg;
temp = y1 - y2 * temp;
arg + temp;

temp + arg;

loop;
  res = arg / temp + temp / 2;
  if res ! pre;
    if pref = 1;
      pre = res;
    if.end;
    temp = res;
  if.else;
    loop.break;
  if.end;
loop.end;

res + temp / 2;

# OUTPUT -> res #
