# | x 0 0 0 | #
# | y 0 0 0 | #
# | z 0 0 0 | #
# | 1 0 0 0 | #
let x,y,z 123 in;

# | a b c d | #
# | e f g h | #
# | i j k l | #
# | 0 0 0 1 | #
let a 1 in;
let b,c,d,e 0 in;
let f 1 in;
let g,h,i,j 0 in;
let k 1 in;
let l 0 in;

let rx,ry,rz 0 out;

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
