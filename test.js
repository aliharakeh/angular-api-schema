class A {
  constructor(a) {
    this.a = a;
  }
}

class B {
  b = 2;
}

const a = new A(2);
console.log('a =', a.a);
Object.assign(a, {a: 1});
console.log('a =', a.a);

const b = new B({dfsfsdfsdfsd: 1});
console.log('b =', b.b);
Object.assign(b, {b: 1});
console.log('b =', b.b);
