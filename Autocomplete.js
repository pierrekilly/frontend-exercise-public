const KEY = {
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ENTER: "Enter"
}

export default class Autocomplete {
  constructor(rootEl, options = {}) {
    options = Object.assign({ numOfResults: 10 }, options);
    Object.assign(this, { rootEl, options });

    this.init();
  }

  async onQueryChange(query) {
    let results = [];

    if (!query) {
      this.updateDropdown(results);
      return;
    }

    // Get data for the dropdown
    if (this.options.data) {
      results = this.getResults(query, this.options.data);
    } else if (this.options.queryUrl && this.options.queryField) {
      let queryResult = await fetch(`${this.options.queryUrl}?${this.options.queryField}=${query}`).then(data => {
        return data.json();
      })
      queryResult.forEach(entry => {
        results.push({
          text: entry[this.options.queryField],
          value: entry
        });
      });
    } else {
      throw new Error("You need to provide either data or a query url and a query field");
    }

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

  updateDropdown(results) {
    this.listEl.innerHTML = '';
    this.listEl.appendChild(this.createResultsEl(results));

    if (results && results.length) {
      this.listEl.style.visibility = "visible";
    } else {
      this.listEl.style.visibility = "hidden";
    }
  }

  selectValue(result) {
    const { onSelect } = this.options;
    if (typeof onSelect === 'function') onSelect(result.value);
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
        this.selectValue(result)
      });

      el.addEventListener("keydown", event => {
        if (event.code === KEY.ENTER) {
          this.selectValue(result)
        }
      })

      el.setAttribute("tabindex", "0")

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

  moveSelection(results, moveDown) {
    let noFocus = true;

    for (let i in results) {
      let index = parseInt(i);
      if (document.activeElement === results[index]) {
        const hasNext = moveDown ? results.length - 1 > index : index - 1 >= 0;
        if (hasNext) {
          noFocus = false;
          let nextIndex = moveDown ? index + 1 : index - 1;
          results[nextIndex].focus();
        }
        break;
      }
    }

    if (noFocus) {
      const defaultIndex = moveDown ? 0 : results.length - 1;
      results[defaultIndex].focus();
    }
  }

  init() {
    // Build query input
    this.inputEl = this.createQueryInputEl();
    this.rootEl.appendChild(this.inputEl)

    // Build results dropdown
    this.listEl = document.createElement('ul');
    this.listEl.style.visibility = "hidden"
    Object.assign(this.listEl, { className: 'results' });
    this.rootEl.appendChild(this.listEl);

    this.rootEl.addEventListener("keydown", event => {
      if (event.code !== KEY.ARROW_UP && event.code !== KEY.ARROW_DOWN) {
        return;
      }
      event.preventDefault();

      let results = this.listEl.getElementsByTagName("li")

      switch (event.code) {
        case KEY.ARROW_UP:
          this.moveSelection(results, false);
          break;
        case KEY.ARROW_DOWN:
          this.moveSelection(results, true);
          break;
      }
    });
  }
}
