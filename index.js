const zero = '+[]';
const one = '+!![]';

const number = n => {
  if (n === 0) return zero;
  return Array.from({length: n}, () => one).join(' + ');
}

const map = {};

const fromString = s =>s.split('').map(x => {
  if (!(x in map)) {
    const charCode = x.charCodeAt(0);
    return `([]+[])[${fromString('constructor')}][${fromString('fromCharCode')}](${number(charCode)})`;
  }
  return map[x];
}).join('+');

str_NaN = "(+{}+[])" // NaN
map.a = `${str_NaN}[${number(1)}]`;

str_object_Object = "({}+[])" // [object Object]
map.o = `${str_object_Object}[${number(1)}]`;
map.b = `${str_object_Object}[${number(2)}]`;
map.e = `${str_object_Object}[${number(4)}]`;
map.c = `${str_object_Object}[${number(5)}]`;
map.t = `${str_object_Object}[${number(6)}]`;
map[' '] = `${str_object_Object}[${number(7)}]`;

str_false = "(![]+[])" // false
map.f = `${str_false}[${number(0)}]`;
map.s = `${str_false}[${number(3)}]`;

str_true = "(!![]+[])" // true
map.r = `${str_true}[${number(1)}]`;
map.u = `${str_true}[${number(2)}]`;

str_Infinity =  `((${one}/${zero})+[])` // Infinity
map.i = `${str_Infinity}[${number(3)}]`;
map.n = `${str_Infinity}[${number(4)}]`;

str_String = `((([]+[])[${fromString('constructor')}])+[])` // function String() { [native code] }
map.S = `${str_String}[${number(9)}]`;
map.g = `${str_String}[${number(14)}]`;

str_RegExp = `(((/-/)[${fromString('constructor')}])+[])` // function RegExp() { [native code] }
map.p = `${str_RegExp}[${number(14)}]`;

str_backslash = "(/\\\\/+[])" // \
map['\\'] = `${str_backslash}[${number(1)}]`;

// decimal 13 = hex d
// likewise, toString(radix) allows us to use up to radix=36, which generates all lowercase letters
map.d = `(${number(13)})[${fromString('toString')}](${number(14)})`;
map.h = `(${number(17)})[${fromString('toString')}](${number(18)})`;
map.m = `(${number(22)})[${fromString('toString')}](${number(23)})`;

str_func_constructor = `(()=>{})[${fromString('constructor')}]`
str_func_escape = `${str_func_constructor}(${fromString('return escape')})()` // build-in string escape function
str_5C = `(${str_func_escape}(${map['\\']}))` // %5C
map.C = `${str_5C}[${number(2)}]`;

const compile = code => `(()=>{})[${fromString('constructor')}](${fromString(code)})()`;

console.log(compile('console.log("Hello world!");'));
