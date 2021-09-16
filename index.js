import Autocomplete from './Autocomplete';
import usStates from './us-states';
import './main.css';


// US States
// const data = usStates.map(state => ({
//   text: state.name,
//   value: state.abbreviation
// }));
// new Autocomplete(document.getElementById('state'), {
//   data,
//   onSelect: (stateCode) => {
//     console.log('selected state:', stateCode);
//   },
// });

// Pokemons
new Autocomplete(document.getElementById("pokemon"), {
  onSelect: (pokemon) => {
    alert(`You selected #${pokemon.id} ${pokemon.name}.
${pokemon.name} has the following types: ${pokemon.typeList.join(", ")}.`)
  },
  queryUrl: "http://localhost:8080/api/pokemon",
  queryField: "name"
})
