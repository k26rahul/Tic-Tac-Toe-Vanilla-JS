/**
 * Displays or hides elements based on a given predicate function.
 *
 * @param {NodeList|HTMLCollection|Array.<Element>} allElements - The collection of elements to be affected.
 * @param {function} predicate - A function that determines whether an element should be displayed or hidden.
 *                               Should take an element as a parameter and return a boolean.
 * @param {string} [displayStyle='block'] - The display style to set for elements that pass the predicate (default is 'block').
 *
 * @example
 * // Display elements with the class 'visible' and hide others
 * const elements = document.querySelectorAll('.some-elements');
 * displayExclusive(elements, element => element.classList.contains('visible'));
 */
export function displayExclusive(
  allElements,
  predicate,
  displayStyle = 'block'
) {
  Array.from(allElements).forEach(element => {
    element.style.display = predicate(element) ? displayStyle : 'none';
  });
}
