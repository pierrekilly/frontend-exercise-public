export default class Autocomplete {
  constructor(rootEl, options = {}) {
    options = Object.assign({
      numOfResults: 10,
      data: []
    }, options);

    Object.assign(this, { rootEl, options });

    this.init();
  }

  async collectData(query) {
    if (this.options.loadExternalData) {
      let ret = null

      if (!query)
        return ret;

      await this.options.loadExternalData(query, this.options.numOfResults)
          .then(data => {
            ret = data
          })

      return ret
    }
     else {
      return this.options.data
    }
  }

  onQueryChange(query) {
    this.collectData(query).then((data) => {
      // Get data for the dropdown
      let results = this.getResults(query, data);
      results = results.slice(0, this.options.numOfResults);

      this.updateDropdown(results);
    })
  }

  /**
   * Given an array and a query, return a filtered array based on the query.
   */
  getResults(query, data) {
    if (!query)
      return [];

    // Filter for matching strings
    return data.filter((item) => {
      return item.text.toLowerCase().includes(query.toLowerCase());
    });
  }

  updateDropdown(results) {
    this.listEl.style.display = results.length ? "block" : "none"

    this.listEl.innerHTML = '';
    this.listEl.appendChild(this.createResultsEl(results));
  }

  createResultsEl(results) {
    const fragment = document.createDocumentFragment();
    results.forEach((result) => {
      const el = document.createElement('li');
      Object.assign(el, {
        className: 'result',
        textContent: result.text,
        valueContent: result.value
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

    inputEl.addEventListener('input', event =>
      this.onQueryChange(event.target.value));

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

    this.selectedItem = null

    this.rootEl.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "ArrowUp":
          if (this.selectedItem) {
            if (this.selectedItem === this.listEl.firstChild) {
              break
            }
            this.selectedItem.classList.remove("selected")
            this.selectedItem = this.selectedItem.previousElementSibling
            this.selectedItem.classList.add("selected")
          }
          break
        case "ArrowDown":
          if (!this.selectedItem) {
            this.selectedItem = this.listEl.firstChild
            this.selectedItem.classList.add("selected")
          } else {
            if (this.selectedItem === this.listEl.lastChild) {
              break
            }
            this.selectedItem.classList.remove("selected")
            this.selectedItem = this.selectedItem.nextElementSibling
            this.selectedItem.classList.add("selected")
          }
          break
        case "Enter":
          this.options.onSelect(this.selectedItem.valueContent)
          break
      }
    });
  }
}
