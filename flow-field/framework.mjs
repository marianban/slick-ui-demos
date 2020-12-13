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
}

function handleOnChange(event) {
  const {
    dataset: { prop },
    value,
    valueAsNumber,
  } = event.target;
  data[prop] = valueAsNumber;
  $$(`[data-prop="${prop}"]`).forEach((el) => {
    el.value = value;
  });
}
