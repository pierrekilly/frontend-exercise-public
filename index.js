import Autocomplete from './Autocomplete';
import usStates from './us-states';
import './main.css';


// US States
new Autocomplete(document.getElementById('state'), {
  data: usStates,
  resultSelector: {
    valueKey: "abbreviation",
    textKey: "name"
  },
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
