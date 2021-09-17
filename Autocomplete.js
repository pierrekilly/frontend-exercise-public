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
    if (this.options.external) {
      let ret = null
      let url = this.buildUrl(query, this.options.numOfResults)

      if (!query)
        return ret;
      
      await fetch(url)
          .then(res => res.json())
          .then(data => ret = data.items.map(item => ({
            text: item.login,
            value: item.id
          })))
          .catch(err => console.log(`error occurred, likely rate limited: ${err}`))

      return ret
    } else {
      return this.options.data
    }
  }

  buildUrl(query) {
    let e = this.options.external
    return `${e.baseUrl}?${e.queryParam}=${query}`
    // TODO use limiterParam
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
