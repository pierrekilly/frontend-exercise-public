import {debounce} from "lodash";
import {createUIElement} from "../uiHelpers";

export default class Autocomplete {

  /**
   * @param rootEl
   * @param options
   *
   * rootEl - the HTML element where the Autocomplete input element will be rendered
   *
   * options - options provided to the component:
   *
   * {
   *   getData: (query: string) => Array;
   *   onSelect: (selectedResult: {text: string, value: string}) => void;
   * }
   */
  constructor(rootEl, options = {}) {
    options = Object.assign({numOfResults: 10, data: []}, options);
    Object.assign(this, {rootEl, options});

    this.results = [];
    this.focusedListElementIndex = null;
    this.query = "";

    this.init();
  }

  async onQueryChange(query) {
    this.query = query;
    let results = [];
    if (query) {
      // Get data for the dropdown
      results = await this.getResults(query);
      results = results.slice(0, this.options.numOfResults);
    }
    this.results = results;
    this.updateDropdown(results);
  }

  /**
   * Invoke getData function to receive search results based on the query value
   */
  async getResults(query) {
    if (!query) return [];

    // Filter for matching strings
    return await this.options.getData(query);
  }

  updateDropdown(results) {
    this.listEl.innerHTML = '';
    if (this.query) {
      // render results list element with the received data
      this.listEl.style.display = 'block';
      this.listEl.appendChild(this.createResultsEl(results));
    } else {
      // hide results list element if there is no value typed in the input field
      this.listEl.style.display = 'none';
      this.focusedListElementIndex = null;
    }
  }

  // Reset all ongoing data from the component related to the typed input value and received results
  resetQuery() {
    this.query = "";
    this.inputEl.value = '';
    this.listEl.style.display = 'none';
    this.focusedListElementIndex = null;
    this.results = [];
  }

  createResultsEl(results) {
    const fragment = document.createDocumentFragment();
    if (results.length) {
      results.forEach((result, index) => {
        const el = createUIElement('li', {
          className: 'result',
          textContent: result.text,
        }, fragment);

        // Pass the selected item to the onSelect callback
        el.addEventListener('click', () => {
          this.handleResultItemSelect(result);
        });
        el.addEventListener('mouseover', () => {
          this.changeFocusedListElement(index);
        });

      });
    } else {
      fragment.appendChild(this.emptyResultElement)
    }

    return fragment;
  }

  // if there is onSelect handler provided in the options, invoke it and pass the selected item as an argument
  handleResultItemSelect(result) {
    const {onSelect} = this.options;
    if (typeof onSelect === 'function') {
      onSelect(result);
      this.resetQuery();
    }
  }

  createQueryInputEl() {
    const inputEl = createUIElement(
      'input',
      {
        type: 'search',
        name: 'query',
        autocomplete: 'off',
      });

    inputEl.addEventListener('input', debounce(event => this.onQueryChange(event.target.value), 300));
    inputEl.addEventListener('keydown', (event) => {
      if (!this.listEl.childNodes.length) {
        return
      }
      // Update corresponding list item's styles when user tries to navigate between them using up/down arrow keys
      // Select focused list item when user types on the "Enter" key
      switch (event.keyCode) {
        case 38:
          this.handleKeyUpDownOnInput("keyUp")
          break;
        case 40:
          this.handleKeyUpDownOnInput("keyDown")
          break;
        case 13:
          if(this.focusedListElementIndex !== null) {
            const selectedData = this.results[this.focusedListElementIndex];
            this.handleResultItemSelect(selectedData);
          }
          break;
      }
    });

    return inputEl;
  }

  // Figure out the next list item element that should be highlighted based on the eventType, which can have one of the
  // fo- keyUp or keyDown
  handleKeyUpDownOnInput(eventType) {
    let newIndex = null;
    if (eventType === "keyUp") {
      newIndex = !this.focusedListElementIndex ? this.results.length - 1 : this.focusedListElementIndex - 1;
    } else if (eventType === "keyDown") {
      newIndex = this.focusedListElementIndex === null || this.focusedListElementIndex === this.results.length - 1 ? 0 : this.focusedListElementIndex + 1;
    }

    this.changeFocusedListElement(newIndex);
  }

  // update the active item from the dropdown list based on the new highlighted item index
  changeFocusedListElement(newIndex) {
    if (this.focusedListElementIndex !== null) {
      this.listEl.childNodes[this.focusedListElementIndex].classList.remove("active");
    }
    this.focusedListElementIndex = newIndex;
    this.listEl.childNodes[this.focusedListElementIndex].classList.add("active");
  }

  // Remove all added event listeners from element
  destroyEventListeners() {
    this.inputEl.replaceWith(this.inputEl.cloneNode(true));
  }

  init() {
    // Build query input
    this.inputEl = this.createQueryInputEl();
    this.rootEl.appendChild(this.inputEl)

    // Build results dropdown
    this.listEl = createUIElement('ul', {className: 'results'}, this.rootEl);

    this.emptyResultElement = createUIElement('li', {
      className: 'noResult',
      textContent: 'No results',
    });
  }
}
