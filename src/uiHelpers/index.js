// create an UI element based on the tag name, assign default properties if there are, attach it as a child to the parent
// element (again, if it is provided) and return the created element
export const createUIElement = (name, sourceToAssign, parentToAppend) => {
  const element = document.createElement(name);
  if (sourceToAssign) {
    Object.assign(element, sourceToAssign)
  }
  if (parentToAppend) {
    parentToAppend.appendChild(element)
  }
  return element;
}
