import usStates from "./us-states.json";

export default class Autocomplete {
  constructor(rootEl, options = {}) {
    options = Object.assign({ numOfResults: 10, data: [] }, options);
    Object.assign(this, { rootEl, options });

    this.init();
  }

  onQueryChange(query) {
    let results = [];

    // Get data for the dropdown

    // From the endpoint
    if (this.options.url || this.options.urlFactory) {
      let url = this.options.url || this.options.urlFactory(query, this.options.numOfResults)
      this.getResultsFromUrl(url).then(results => {
        results = results.map(res => ({ text: res[this.options.resultSelector.valueKey], value: res[this.options.resultSelector.valueKey] })).slice(0, this.options.numOfResults)
        this.updateDropdown(results)
      })

      return
    }

    // From static data
    results = this.getResults(query, this.options.data);
    results = results.slice(0, this.options.numOfResults);

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

  async getResultsFromUrl(url) {
    const response = await fetch(url).then(resp => resp.json())

    return response[this.options.resultSelector.resultsKey]

    for (const [key, value] of Object.entries(response)) {
      if (Array.isArray(value)) {
        return value
      }
    }

    return []
  }

  updateDropdown(results) {
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
  }
}
