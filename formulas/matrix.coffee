# INPUT #
# | x 0 0 0 | #
# | y 0 0 0 | #
# | z 0 0 0 | #
# | 1 0 0 0 | #
>>> 引数;
let x,y,z 123;
>>> =====;

# | a b c d | #
# | e f g h | #
# | i j k l | #
# | 0 0 0 1 | #
let a,b,c,d,e,f,g,h,i,j,k,l 0;
a,f,k = 1;
let rx,ry,rz 0;
let t 0;

t = x * a; rx = t;
t = y * b; rx + t;
t = z * c; rx + t + d;

t = x * e; ry = t;
t = y * f; ry + t;
t = z * g; ry + t + h;

t = x * i; rz = t;
t = y * j; rz + t;
t = z * k; rz + t + l;

# OUTPUT -> rx,ry,rz #
>>> 出力;
rx = rx;
ry = ry;
rz = rz;
