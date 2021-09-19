import SourceProvider from "./SourceProvider";

const defaultFilterFunction = () => {
  return Promise.resolve([]);
}

export default class AsyncDataProvider extends  SourceProvider {
  /**
   * @param url - url that should be used to fetch data
   * @param defaultParams - default query params that need to be passed in the fetch
   * @param queryFieldName - property name for the queried value
   * @param changeResultsFormat - function to convert results from API response into the custom ones
   */
  constructor(url, defaultParams, queryFieldName, changeResultsFormat) {
    super();

    this.url = url;
    this.defaultParams = defaultParams || {};
    this.queryFieldName = queryFieldName;
    this.changeResultsFormat = changeResultsFormat;
    this.filterFunction = url ? window.fetch.bind(window) : defaultFilterFunction;
  }

  async getData(query = "") {
    const params = Object.assign(this.defaultParams, { [this.queryFieldName]: query });

    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${this.url}?${queryParams}`);
    const responseData = await response.json();
    const items = responseData.items || [];
    if (items.length && typeof this.changeResultsFormat === "function") {
      return this.changeResultsFormat(items)
    }
    return items
  }
}
