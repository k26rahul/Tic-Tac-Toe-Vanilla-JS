export function displayExclusive(
  elements,
  conditionCallback,
  displayValue = 'block'
) {
  [...elements].forEach(element => {
    element.style.display = conditionCallback(element) ? displayValue : 'none';
  });
}
