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
  external: {
    baseUrl: "https://api.github.com/search/users",
    queryParam: "q",
    limiterParam: "per_page"
  },
  onSelect: (ghUserId) => {
    console.log('selected github user id:', ghUserId);
  },
});
