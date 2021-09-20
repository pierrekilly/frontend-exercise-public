import Autocomplete from "./Autocomplete";
import AsyncDataProvider from "../providers/AsyncDataProvider";

// convert the results from the API to the format that is acceptable for Autocomplete component
const convertResultsToAutocompleteFormat = (items) => {
  return items.map(item => ({
    text: item.login,
    value: item.id,
  }))
}

const url = "https://api.github.com/search/users";
const dataProvider = new AsyncDataProvider(
  url, {
    per_page: 10
  },
  "q",
  convertResultsToAutocompleteFormat
);

function createGithubUsersComponent(container, selectedUserElement) {
  return new Autocomplete(container, {
    getData: async (query) => await dataProvider.getData(query),
    onSelect: (selectedItem) => {
      selectedUserElement.innerHTML = `Selected User: ${selectedItem.text} (id - ${selectedItem.value})`
    },
  });
}

export default function renderGithubUsersAutocomplete(mainContainerId, selectedElementContainerId) {
  const container = document.getElementById(mainContainerId);
  const selectedUserElement = document.getElementById(selectedElementContainerId);
console.log('container', container)
  if (container) {
    return createGithubUsersComponent(container, selectedUserElement)
  }

  throw Error('There is no element with the provided id for the GithubUsers container')
}
