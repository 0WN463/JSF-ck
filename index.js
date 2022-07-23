const zero = '+[]';
const one = '+!![]';

const number = n => {
  if (n === 0) return zero;
  return Array.from({length: n}, () => one).join(' + ');
}

const map = {};

const fromString = s => s.split('').map(x => {
  if (!(x in map)) {
    const charCode = x.charCodeAt(0);
    return `([]+[])[${str_constructor}][${str_fromCharCode}](${number(charCode)})`;
  }
  return map[x];
}).join('+');

const updateMap = (map, fkStr) => {
  [...eval(fkStr)].forEach((c, i) => map[c] = `${fkStr}[${number(i)}]`)
}

const str_NaN = "(+{}+[])" // NaN
updateMap(map, str_NaN)
// important chars: 'a'

const str_object_Object = "({}+[])" // [object Object]
updateMap(map, str_object_Object)
// important chars: 'o' 'b' 'e' 'c' 't' ' '

const str_false = "(![]+[])" // false
updateMap(map, str_false)
// important chars: 'f' 's'

const str_true = "(!![]+[])" // true
updateMap(map, str_true)
// important chars: 'r' 'u'

const str_Infinity =  `((${one}/${zero})+[])` // Infinity
updateMap(map, str_Infinity)
// important chars: 'i' 'n'

// Now we have access to constructor
const str_constructor = fromString('constructor')

const str_String = `((([]+[])[${str_constructor}])+[])` // function String() { [native code] }
map.S = `${str_String}[${number(9)}]`;
map.g = `${str_String}[${number(14)}]`;
// important chars: 'S' 'g'

// Now we have access to toString
const str_toString = fromString('toString')

const str_RegExp = `(((/-/)[${str_constructor}])+[])` // function RegExp() { [native code] }
map.p = `${str_RegExp}[${number(14)}]`;
// important chars: 'p'

// decimal 13 = hex d
// likewise, toString(radix) allows us to use up to radix=36, which generates all lowercase letters

for (let i = 0; i < 26; ++i) {
  const letter = String.fromCharCode(i + 'a'.charCodeAt())
  if (!(letter in map)) 
    map[letter] = `(${number(10+i)})[${str_toString}](${number(11+i)})`;
}

const str_func_constructor = `(()=>{})[${str_constructor}]` // function constructor accepts a string and turns it into a function
const str_func_escape = `${str_func_constructor}(${fromString('return escape')})()` // built-in string escape function

// We want backslash to escape it to get "%5C"
const str_backslash = "(/\\\\/+[])" // /\\/
updateMap(map, str_backslash)

const str_5C = `(${str_func_escape}(${map['\\']}))` // %5C
map.C = `${str_5C}[${number(2)}]`;

// Now we have access to fromCharCode, which means we can compile any code
const str_fromCharCode = fromString('fromCharCode')

const compile = code => `(()=>{})[${str_constructor}](${fromString(code)})()`;

console.log(compile('console.log("Hello world!");'));
