export default class DisplayController {
  constructor(allElements) {
    this.allElements = allElements;
  }

  displayExclusive(visibleElements, displayStyle = 'block') {
    this.allElements.forEach(element => {
      element.style.display = visibleElements.includes(element)
        ? displayStyle
        : 'none';
    });
  }
}
