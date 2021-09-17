import _ from "lodash";

const selectedClass = "selected"

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
    return data.filter((item) => {
      return item.text.toLowerCase().includes(query.toLowerCase());
    });
  }

  async getDataFromUrl(url) {
    let data = []
    try {
      const resp = await fetch(url).
        then(resp => {
          if (resp.status >= 400) {
            throw new Error("Request failed")
          }
        }).
        then(resp => resp.json())

      if (this.options.dataSelector.dataKey) {
        data = _.get(resp, this.options.dataSelector.dataKey) || []
      } else {
        data = resp
      }
    } catch(err) {
      return []
    }

    return data.map((entry) => ({
      text: _.get(entry, this.options.dataSelector.textKey),
      value: _.get(entry, this.options.dataSelector.valueKey)
    }))
  }

  updateDropdown(results) {
    this.listEl.innerHTML = '';
    this.listEl.hidden = results.length === 0
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
      el.addEventListener('click', () => {
        const { onSelect } = this.options;
        if (typeof onSelect === 'function') onSelect(result.value);
      });

      document.addEventListener('keyup', (event) => {
        if (event.code !== "Enter" || !el.classList.contains(selectedClass)) {
          return
        }

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
    Object.assign(this.listEl, { className: 'results', hidden: true });
    this.rootEl.appendChild(this.listEl);

    // Fetch data
    if (this.options.url) {
      this.getDataFromUrl(this.options.url).then(data => {
        this.options.data = data
      })
    }

    this.handleArrowNavigation()
  }

  handleArrowNavigation() {
    this.inputEl.addEventListener("focus", () => {
      if (!this.listEl.children.length) {
        return
      }

      this.listEl.children[0].classList.add(selectedClass)
    })

    this.inputEl.addEventListener("blur", () => {
      this.clearSelected()
    })

    // Set up arrow navigation
    document.addEventListener("keydown", (event) => {
      // Ignore if not in focus
      if (this.inputEl !== document.activeElement) {
        return
      }

      // Nothing to select
      if (!this.listEl.children.length) {
        return
      }

      // Select first element
      let selectedResult = this.getSelected()
      if (!selectedResult) {
        this.listEl.children[0].classList.add(selectedClass)
        return
      }

      selectedResult.classList.remove(selectedClass);
      switch(event.code){
        case "ArrowUp":
          if (selectedResult.previousElementSibling) {
            selectedResult = selectedResult.previousElementSibling
          }
          break;
        case "ArrowDown":
          if (selectedResult.nextElementSibling) {
            selectedResult = selectedResult.nextElementSibling
          }
          break;
      }
      selectedResult.classList.add(selectedClass)
    })
  }

  getSelected() {
    for (const childEl of this.listEl.children) {
      if (childEl.classList.contains(selectedClass)) {
        return childEl
      }
    }

    return null
  }

  clearSelected() {
    for (const childEl of this.listEl.children) {
      childEl.classList.remove(selectedClass)
    }
  }
}
