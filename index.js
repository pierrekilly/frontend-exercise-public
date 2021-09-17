import Autocomplete from "./Autocomplete"
import usStates from "./us-states"
import "./main.css"


// US States
const data = usStates.map(state => ({
	text: state.name,
	value: state.abbreviation
}))

new Autocomplete(document.getElementById("state"), {
	data: data,
	onSelect: (stateCode) => {
		console.log("selected state:", stateCode)
	},
})


// Github Users
new Autocomplete(document.getElementById("gh-user"), {
	//url: "https://api.github.com/search/users?q=romanpr&per_page=5",
	urlFactory: (query, limit) => {
		return `https://api.github.com/search/users?q=${query}&per_page=${limit}`
	},
	dataSelector: {
		dataKey: "items",
		textKey: "login",
		valueKey: "id"
	},
	onSelect: (ghUserId) => {
		console.log("selected github user id:", ghUserId)
	},
})
