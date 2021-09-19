import './main.css';
import renderStatesAutocomplete from './components/States';
import renderGithubUsersAutocomplete from "./components/GithubUsers";

// render autocomplete component for US states
renderStatesAutocomplete("state", "selected-state");
// render autocomplete component for github users
renderGithubUsersAutocomplete("gh-user", "gh-selected-user");
