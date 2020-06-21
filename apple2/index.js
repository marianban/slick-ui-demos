console.clear();

const keys = [
  { key: 'Esc', key2: '' },
  { key: 'bang', key2: '1', print: '1' },
  { key: 'at', key2: '2', print: '2' },
  { key: 'hash', key2: '3', print: '3' },
  { key: 'dolar', key2: '4', print: '4' },
  { key: 'prc', key2: '5', print: '5' },
  { key: 'caret', key2: '6', print: '6' },
  { key: 'amp', key2: '7', print: '7' },
  { key: 'star', key2: '8', print: '8' },
  { key: 'lp', key2: '9', print: '9' },
  { key: 'rp', key2: '0', print: '0' },
  { key: '-', key2: '_' },
  { key: 'plus', key2: 'eq' },
  { key: 'Del', key2: '' },
  { key: '⇥', key2: '' },
  { key: 'Q', key2: '' },
  { key: 'W', key2: '' },
  { key: 'E', key2: '' },
  { key: 'R', key2: '' },
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

let keysContainer, keyTemplate;

document.addEventListener('DOMContentLoaded', () => {
  keysContainer = document.querySelector('.keys-container');
  keyTemplate = document.querySelector('.key--template');

  for (let i = 0; i < keys.length; i++) {
    const key = keyTemplate.cloneNode(true);
    key.classList.remove('key--template');
    key.classList.add('key--' + keys[i].key);
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
    } else if (lines[line].length < 80) {
      if (keycode === SPACEBAR) {
        lines[line] += '\u00A0'; // non breaking space
      } else {
        lines[line] += event.key;
      }
    }
  }
  render();
});

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
