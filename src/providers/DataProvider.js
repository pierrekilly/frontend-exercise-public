import SourceProvider from "./SourceProvider";

// defaultFilterFunction assumes that the data items has the format required by Autocomplete component, i.e.
// {text: string; value: string}[]
const defaultFilterFunction = (data, query) => {
  const results = data.filter((item) => {
    return item.text.toLowerCase().includes(query.toLowerCase());
  })

  return results;
}

export default class DataProvider extends  SourceProvider {
  /**
   * @param data - the whole data list
   * @param filterFunction - DataProvider has it's default filter function, but it also accepts a custom function in
   * case data format is different or there is other logic to filter data based on the query value
   */
  constructor(data, filterFunction) {
    super();

    this.data = data;
    this.filterFunction = filterFunction || defaultFilterFunction;
  }

  getData(query = "") {
    return this.filterFunction(this.data, query)
  }
}
