import usStates from "./us-states.json";
import _ from "lodash";

export default class Autocomplete {
  constructor(rootEl, options = {}) {
    options = Object.assign({ numOfResults: 10, data: [] }, options);
    Object.assign(this, { rootEl, options });

    this.init();
  }

  onQueryChange(query) {
    // Get data for the dropdown
    if (this.options.urlFactory) {
      let url = this.options.urlFactory(query, this.options.numOfResults)
      this.getDataFromUrl(url).then(data => {
        let results = this.getResults(query, data)
        this.updateDropdown(results)
      })
      return
    }

    let results = this.getResults(query, this.options.data);
    this.updateDropdown(results);
  }

  /**
   * Given an array and a query, return a filtered array based on the query.
   */
  getResults(query, data) {
    if (!query) return [];

    // Filter for matching strings
    let results = data.filter((item) => {
      return item.text.toLowerCase().includes(query.toLowerCase());
    });

    return results;
  }

  async getDataFromUrl(url) {
    const resp = await fetch(url).then(resp => resp.json())

    let data = resp
    if (this.options.dataSelector.dataKey) {
      data = _.get(resp, this.options.dataSelector.dataKey)
    }

    return data.map((entry) => ({
      text: _.get(entry, this.options.dataSelector.textKey),
      value: _.get(entry, this.options.dataSelector.valueKey)
    }))
  }

  updateDropdown(results) {
    this.listEl.innerHTML = '';
    this.listEl.appendChild(this.createResultsEl(results.slice(0, this.options.numOfResults)));
  }

  createResultsEl(results) {
    const fragment = document.createDocumentFragment();
    results.forEach((result) => {
      const el = document.createElement('li');
      Object.assign(el, {
        className: 'result',
        textContent: result.text,
      });

      // Pass the value to the onSelect callback
      el.addEventListener('click', (event) => {
        const { onSelect } = this.options;
        if (typeof onSelect === 'function') onSelect(result.value);
      });

      fragment.appendChild(el);
    });
    return fragment;
  }

  createQueryInputEl() {
    const inputEl = document.createElement('input');
    Object.assign(inputEl, {
      type: 'search',
      name: 'query',
      autocomplete: 'off',
    });

    let timeoutID = null
    inputEl.addEventListener('input', event => {
      // Debounce
      if (timeoutID) {
        clearTimeout(timeoutID)
      }

      timeoutID = setTimeout(() => {
        this.onQueryChange(event.target.value)
      }, 1000)
    })

    return inputEl;
  }

  init() {
    // Build query input
    this.inputEl = this.createQueryInputEl();
    this.rootEl.appendChild(this.inputEl)

    // Build results dropdown
    this.listEl = document.createElement('ul');
    Object.assign(this.listEl, { className: 'results' });
    this.rootEl.appendChild(this.listEl);

    const selectedClass = "selected"
    let selectedResult = null

    this.inputEl.addEventListener("focus", () => {
      if (!this.listEl.children.length) {
        selectedResult = null
      }

      selectedResult = this.listEl.children[0]
      selectedResult.classList.add(selectedClass)
    })

    // Set up arrow navigation
    document.addEventListener("keydown", (event) => {
      // Ignore if not in focus
      if (this.inputEl !== document.activeElement) {
        return
      }

      // Nothing to select
      if (!this.listEl.children.length) {
        selectedResult = null
        return
      }

      // Select first element
      if (!selectedResult) {
        selectedResult = this.listEl.children[0]
        selectedResult.classList.add(selectedClass)
        return
      }

      selectedResult.classList.remove(selectedClass);
      switch(event.code){
          // Up
        case "ArrowUp":
          if (selectedResult.previousElementSibling) {
            selectedResult = selectedResult.previousElementSibling
          }
          break;
          // Down
        case "ArrowDown":
          if (selectedResult.nextElementSibling) {
            selectedResult = selectedResult.nextElementSibling
          }
          break;
      }
      selectedResult.classList.add(selectedClass)
    });

    // Fetch data
    if (this.options.url) {
      this.getDataFromUrl(this.options.url).then(data => {
        this.options.data = data
      })
    }
  }
}
