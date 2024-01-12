export function displayExclusive(elements, conditionCallback) {
  [...elements].forEach(element => {
    if (conditionCallback(element)) element.classList.add('active');
    else {
      element.classList.remove('active');
    }
  });
}
