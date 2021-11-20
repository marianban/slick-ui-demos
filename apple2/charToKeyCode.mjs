const keys = [
  { key: 'Esc', key2: '' },
  { key: 'bang', key2: '1', code: 49 },
  { key: 'at', key2: '2', code: 50 },
  { key: 'hash', key2: '3', code: 51 },
  { key: 'dolar', key2: '4', code: 52 },
  { key: 'prc', key2: '5', code: 53 },
  { key: 'caret', key2: '6', code: 54 },
  { key: 'amp', key2: '7', code: 55 },
  { key: 'star', key2: '8', code: 56 },
  { key: 'lp', key2: '9', code: 57 },
  { key: 'rp', key2: '0', code: 48 },
  { key: '-', key2: '_', code: 189 },
  { key: 'plus', key2: 'eq', code: 187 },
  { key: 'Del', key2: '' },
  { key: '⇥', key2: '' },
  { key: 'Q', key2: '', code: 81 },
  { key: 'W', key2: '', code: 87 },
  { key: 'E', key2: '', code: 69 },
  { key: 'R', key2: '', code: 82 },
  { key: 'T', key2: '' },
  { key: 'Y', key2: '' },
  { key: 'U', key2: '' },
  { key: 'I', key2: '' },
  { key: 'O', key2: '' },
  { key: 'P', key2: '' },
  { key: 'lb', key2: 'lbr' },
  { key: 'rb', key2: 'rbr' },
  { key: '↵', key2: '' },
  { key: 'Ctrl', key2: '' },
  { key: 'A', key2: '' },
  { key: 'S', key2: '' },
  { key: 'D', key2: '' },
  { key: 'F', key2: '' },
  { key: 'G', key2: '' },
  { key: 'H', key2: '' },
  { key: 'J', key2: '' },
  { key: 'K', key2: '' },
  { key: 'L', key2: '' },
  { key: 'semi', key2: 'colon' },
  { key: 'dquote', key2: 'quote' },
  { key: 'tild', key2: 'dot' },
  { key: '⇧L', key2: '' },
  { key: 'pipe', key2: 'backslash' },
  { key: 'Z', key2: '' },
  { key: 'X', key2: '' },
  { key: 'C', key2: '' },
  { key: 'V', key2: '' },
  { key: 'B', key2: '' },
  { key: 'N', key2: '' },
  { key: 'M', key2: '' },
  { key: 'langleb', key2: 'comma' },
  { key: 'rangleb', key2: 'dot' },
  { key: 'qmark', key2: 'slash' },
  { key: '⇧', key2: '' },
  { key: '⇩', key2: '' },
  { key: 'none', key2: '' },
  { key: '', key2: '' },
  { key: '_', key2: '' },
  { key: 'r', key2: '' },
  { key: '⭠', key2: '' },
  { key: '⭢', key2: '' },
  { key: '⭣', key2: '' },
  { key: '⭡', key2: '' },
];

function getKeyLabel(key) {
  switch (key) {
    case '⇧L':
      return '⇧';
    case 'plus':
      return '+';
    case 'lb':
      return '[';
    case 'rb':
      return ']';
    case 'semi':
      return ';';
    case 'dquote':
      return '"';
    case 'tild':
      return '~';
    case 'langleb':
      return '<';
    case 'rangleb':
      return '>';
    case 'qmark':
      return '?';
    case 'backslash':
      return '\\';
    case 'r':
      return '';
    case 'quote':
      return "'";
    case 'colon':
      return ':';
    case 'pipe':
      return '|';
    case 'bang':
      return '!';
    case 'at':
      return '@';
    case 'hash':
      return '#';
    case 'prc':
      return '%';
    case 'dolar':
      return '$';
    case 'caret':
      return '^';
    case 'amp':
      return '&';
    case 'star':
      return '*';
    case 'lp':
      return '(';
    case 'rp':
      return ')';
    case 'eq':
      return '=';
    case 'lbr':
      return '{';
    case 'rbr':
      return '}';
    case 'slash':
      return '/';
    case 'comma':
      return ',';
    case 'dot':
      return '.';
  }

  return key;
}

const keyCharToCode = {
  Backspace: 8,
  Tab: 9,
  Enter: 13,
  Shift: 16,
  Ctrl: 17,
  Alt: 18,
  'Pause/Break': 19,
  'Caps Lock': 20,
  Esc: 27,
  Space: 32,
  'Page Up': 33,
  'Page Down': 34,
  End: 35,
  Home: 36,
  Left: 37,
  Up: 38,
  Right: 39,
  Down: 40,
  Insert: 45,
  Delete: 46,
  '0': 48,
  '1': 49,
  '2': 50,
  '3': 51,
  '4': 52,
  '5': 53,
  '6': 54,
  '7': 55,
  '8': 56,
  '9': 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  Windows: 91,
  'Right Click': 93,
  'Numpad 0': 96,
  'Numpad 1': 97,
  'Numpad 2': 98,
  'Numpad 3': 99,
  'Numpad 4': 100,
  'Numpad 5': 101,
  'Numpad 6': 102,
  'Numpad 7': 103,
  'Numpad 8': 104,
  'Numpad 9': 105,
  'Numpad *': 106,
  'Numpad +': 107,
  'Numpad -': 109,
  'Numpad .': 110,
  'Numpad /': 111,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  'Num Lock': 144,
  'Scroll Lock': 145,
  'My Computer': 182,
  'My Calculator': 183,
  ';': 186,
  '=': 187,
  ',': 188,
  '-': 189,
  '.': 190,
  '/': 191,
  '`': 192,
  '[': 219,
  '\\': 220,
  ']': 221,
  "'": 222,
};

const newKeys = keys.map((key) => {
  const label = getKeyLabel(key.key);
  const keyCode = keyCharToCode[label];

  if (key)
    return {
      ...key,
      keyCode,
    };
});

console.log(JSON.stringify(newKeys));
