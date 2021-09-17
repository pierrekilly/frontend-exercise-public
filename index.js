import Autocomplete from './Autocomplete';
import {QueryType} from "./Autocomplete";
import usStates from './us-states';
import './main.css';

// US States
const data = usStates.map(state => ({
  text: state.name,
  value: state.abbreviation
}));
new Autocomplete(document.getElementById('state'), {
  data,
  onSelect: (stateCode) => {
    console.log('selected state:', stateCode);
  },
});

// Github Users
new Autocomplete(document.getElementById('gh-user'), {
  loadExternalData: (query, limit) => {
    return fetch(`https://api.github.com/search/users?q=${encodeURI(query)}&per_page=${limit}`)
        .then(res => res.json())
        .then((data) => {
          return data.items.map(item => ({
            text: item.login,
            value: item.id
          }))
        })
  },
  onSelect: (ghUserId) => {
    console.log('selected github user id:', ghUserId);
  },
});
