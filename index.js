import Autocomplete from './Autocomplete';
import usStates from './us-states';
import './main.css';


// US States
const data = usStates.map(state => ({
  text: state.name,
  value: state.abbreviation
}));

new Autocomplete(document.getElementById('state'), {
  data: data,
  onSelect: (stateCode) => {
    console.log('selected state:', stateCode);
  },
});


// Github Users
new Autocomplete(document.getElementById('gh-user'), {
  urlFactory: (query, limit) => {
    return `https://api.github.com/search/users?q=${query}&per_page=${limit}`
  },
  resultSelector: {
    resultsKey: "items",
    valueKey: "login",
    idKey: "id"
  },

  onSelect: (ghUserId) => {
    console.log('selected github user id:', ghUserId);
  },
});
