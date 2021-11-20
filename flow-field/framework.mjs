export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

let data = null;

export function initForm(initialData) {
  const $inputs = $$('[data-prop]');
  data = initialData;
  $inputs.forEach(($input) => {
    const { prop } = $input.dataset;
    $input.value = data[prop];
    $input.addEventListener('input', handleOnChange);
  });

  const $elements = $$('[id]');
  const elementsMap = Array.from($elements).reduce((acc, $el) => {
    acc[$el.id] = $el;
    return acc;
  }, {});

  const callbacks = [];

  const on = (prop, callback) => {
    callbacks.push({ prop, callback });
  };

  return { elements: elementsMap, on };

  function handleOnChange(event) {
    const {
      dataset: { prop },
      value,
      valueAsNumber,
    } = event.target;
    data[prop] = valueAsNumber;
    const propCallbacks = callbacks.filter(
      (callback) => callback.prop === prop
    );
    propCallbacks.forEach(({ callback }) => {
      callback(valueAsNumber);
    });
    $$(`[data-prop="${prop}"]`).forEach((el) => {
      el.value = value;
    });
  }
}
