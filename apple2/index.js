console.clear();

const keys = [
  { key: 'Esc', key2: '', keyCode: 27 },
  { key: 'bang', key2: '1', keyCode: 49 },
  { key: 'at', key2: '2', keyCode: 50 },
  { key: 'hash', key2: '3', keyCode: 51 },
  { key: 'dolar', key2: '4', keyCode: 52 },
  { key: 'prc', key2: '5', keyCode: 53 },
  { key: 'caret', key2: '6', keyCode: 54 },
  { key: 'amp', key2: '7', keyCode: 55 },
  { key: 'star', key2: '8', keyCode: 56 },
  { key: 'lp', key2: '9', keyCode: 57 },
  { key: 'rp', key2: '0', keyCode: 48 },
  { key: '-', key2: '_', keyCode: 189 },
  { key: 'plus', key2: 'eq', keyCode: 187 },
  { key: 'Del', key2: '', keyCode: 8 },
  { key: '⇥', key2: '', keyCode: 9 },
  { key: 'Q', key2: '', code: 81, keyCode: 81 },
  { key: 'W', key2: '', code: 87, keyCode: 87 },
  { key: 'E', key2: '', code: 69, keyCode: 69 },
  { key: 'R', key2: '', code: 82, keyCode: 82 },
  { key: 'T', key2: '', keyCode: 84 },
  { key: 'Y', key2: '', keyCode: 89 },
  { key: 'U', key2: '', keyCode: 85 },
  { key: 'I', key2: '', keyCode: 73 },
  { key: 'O', key2: '', keyCode: 79 },
  { key: 'P', key2: '', keyCode: 80 },
  { key: 'lb', key2: 'lbr', keyCode: 219 },
  { key: 'rb', key2: 'rbr', keyCode: 221 },
  { key: '↵', key2: '', keyCode: 13 },
  { key: 'Ctrl', key2: '', keyCode: 17 },
  { key: 'A', key2: '', keyCode: 65 },
  { key: 'S', key2: '', keyCode: 83 },
  { key: 'D', key2: '', keyCode: 68 },
  { key: 'F', key2: '', keyCode: 70 },
  { key: 'G', key2: '', keyCode: 71 },
  { key: 'H', key2: '', keyCode: 72 },
  { key: 'J', key2: '', keyCode: 74 },
  { key: 'K', key2: '', keyCode: 75 },
  { key: 'L', key2: '', keyCode: 76 },
  { key: 'semi', key2: 'colon', keyCode: 186 },
  { key: 'dquote', key2: 'quote', keyCode: 222 },
  { key: 'tild', key2: 'dot', keyCode: 220 },
  { key: '⇧L', key2: '', keyCode: 16 },
  { key: 'pipe', key2: 'backslash', keyCode: 192 },
  { key: 'Z', key2: '', keyCode: 90 },
  { key: 'X', key2: '', keyCode: 88 },
  { key: 'C', key2: '', keyCode: 67 },
  { key: 'V', key2: '', keyCode: 86 },
  { key: 'B', key2: '', keyCode: 66 },
  { key: 'N', key2: '', keyCode: 78 },
  { key: 'M', key2: '', keyCode: 77 },
  { key: 'langleb', key2: 'comma', keyCode: 188 },
  { key: 'rangleb', key2: 'dot', keyCode: 190 },
  { key: 'qmark', key2: 'slash', keyCode: 191 },
  { key: '⇧', key2: '' },
  { key: '⇩', key2: '' },
  { key: 'none', key2: '' },
  { key: '', key2: '', keyCode: 91 },
  { key: '_', key2: '', keyCode: 32 },
  { key: 'r', key2: '', keyCode: 93 },
  { key: '⭠', key2: '', keyCode: 37 },
  { key: '⭢', key2: '', keyCode: 39 },
  { key: '⭣', key2: '', keyCode: 40 },
  { key: '⭡', key2: '', keyCode: 38 },
];
let keysContainer, keyTemplate;

document.addEventListener('DOMContentLoaded', () => {
  keysContainer = document.querySelector('.keys-container');
  keyTemplate = document.querySelector('.key--template');

  for (let i = 0; i < keys.length; i++) {
    const key = keyTemplate.cloneNode(true);
    key.classList.remove('key--template');
    key.classList.add('key--' + keys[i].key);
    if (keys[i].keyCode) {
      key.classList.add('key-code--' + keys[i].keyCode);
    }
    const keyLabelTop = key.querySelector('.key__label-top');
    if (keys[i].key === '') {
      const appleFilled = document.createElement('div');
      appleFilled.classList.add('apple-outlined');
      keyLabelTop.appendChild(appleFilled);
    } else if (keys[i].key === 'r') {
      const appleFilled = document.createElement('div');
      appleFilled.classList.add('apple-filled');
      keyLabelTop.appendChild(appleFilled);
    } else {
      keyLabelTop.innerText = getKeyLabel(keys[i].key);
    }

    const keyLabelBottom = key.querySelector('.key__label-bottom');
    keyLabelBottom.innerText = getKeyLabel(keys[i].key2);
    keysContainer.appendChild(key);
  }

  updateKeysZ();
  render();
});

window.addEventListener('resize', updateKeysZ);

function updateKeysZ() {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      for (let i = 0; i < keys.length; i++) {
        const keyClass = '.key--' + keys[i].key;
        const key = keysContainer.querySelector(keyClass);
        if (key) {
          const keyRight = key.querySelector('.key__side--right');
          const z = key.offsetWidth;
          keyRight.style.setProperty(
            '--key-right-z',
            'calc(-0.75vmin + ' + z + 'px)'
          );

          if (keys[i].key === '↵') {
            const keyFront = key.querySelector('.key__side--front');
            console.log('front', key.offsetHeight);
            const frontOffset = key.offsetHeight;
            console.log({ frontOffset }, keyFront);
            console.dir(keyFront);
            keyFront.style.setProperty(
              '--height-half',
              'calc(-0.75vmin + ' + frontOffset + 'px)'
            );
          }
        } else {
          console.log(keys[i].key);
        }
      }
    });
  });
}

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

let line = 0;
const lines = [']'];
const ENTER = 13;
const BACKSPACE = 8;
const SPACEBAR = 32;

document.addEventListener('keydown', (event) => {
  if (event.isComposing || event.keyCode === 229) {
    return;
  }

  const keycode = event.keyCode;

  animateKey(keycode);

  const isPrintable =
    (keycode > 47 && keycode < 58) || // number keys
    keycode == SPACEBAR ||
    keycode == ENTER || // spacebar & return key(s) (if you want to allow carriage returns)
    keycode == BACKSPACE ||
    (keycode > 64 && keycode < 91) || // letter keys
    (keycode > 95 && keycode < 112) || // numpad keys
    (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
    (keycode > 218 && keycode < 223); // [\]' (in order)

  if (isPrintable) {
    console.log({ line, length: lines[line].length });
    if (keycode === ENTER) {
      if (line === 23) {
        // end of screen get rid of first line
        line--;
        lines.splice(0, 1);
      }

      line++;
      if (!lines[line]) {
        lines[line] = ']';
      }
    } else if (keycode === BACKSPACE) {
      if (lines[line].length <= 1 && line > 0) {
        lines.pop();
        line--;
      } else {
        const length = lines[line].length - 1;
        lines[line] = lines[line].slice(0, Math.max(1, length));
      }
    } else if (lines[line].length < 40) {
      if (keycode === SPACEBAR) {
        lines[line] += '\u00A0'; // non breaking space
      } else {
        lines[line] += event.key;
      }
    }
  }
  render();
});

function animateKey(keyCode) {
  const key = document.querySelector(`.key-code--${keyCode}`);
  console.log({ key });
  if (key) {
    const movement = [
      { transform: 'translateZ(-0.5rem)' },
      { transform: 'translateZ(0rem)' },
    ];
    const timing = {
      duration: 500,
      iterations: 1,
      direction: 'alternate',
      easing: 'ease-in-out',
    };
    key.animate(movement, timing);
  }
}

const terminal = document.querySelector('.monitor__terminal');
function render() {
  terminal.innerHTML = '';
  for (let i = 0; i < lines.length; i++) {
    const line = document.createElement('div');
    line.textContent = lines[i];
    const lastLine = i === lines.length - 1;
    if (lastLine) {
      const cursor = document.createElement('span');
      cursor.classList.add('cursor');
      line.appendChild(cursor);
    }
    terminal.appendChild(line);
  }
}
