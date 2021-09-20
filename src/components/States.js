// US States
import usStates from "../data/us-states.json";
import Autocomplete from "./Autocomplete";
import DataProvider from "../providers/DataProvider";

const data = usStates.map(state => ({
  text: state.name,
  value: state.abbreviation
}));
const dataProvider = new DataProvider(data);

function createStatesComponent(container, selectedStateElement) {
  return new Autocomplete(container, {
    getData: dataProvider.getData,
    onSelect: (selectedItem) => {
      selectedStateElement.innerHTML = `Selected State: ${selectedItem.text} (${selectedItem.value})`
    },
  });
}

export default function renderStatesAutocomplete(mainContainerId, selectedElementContainerId) {
  const container = document.getElementById(mainContainerId);
  const selectedStateElement = document.getElementById(selectedElementContainerId);

  if (container) {
    return createStatesComponent(container, selectedStateElement);
  }

  throw Error('There is no element with the provided id for the States container')
}
