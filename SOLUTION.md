# Solution Docs

<!-- You can include documentation, additional setup instructions, notes etc. here -->

## API
```javascript
const element = document.getElementById("my-element-id")

// Variant 1, static data
const options = {
    data: [
    	{ text: "my-item", value: "my-item-1994"}
    ],
    onSelect: (value) => { doSomething(value) }
}

// Variant 2, data from static URL
const options = {
	url: "https://api.github.com/search/users?q=romanpr&per_page=5",
	onSelect: (value) => { doSomething(value) }
}

// Variant 3, data from dynamic URL
// Automcomplete calls urlFactory to construct the URL to fetch data.
// DataSelector is used to extract data to prepopulate the autocomplete list with.
const options = {
	urlFactory: (query, limit) => {
		return `https://my-url.com?q=${param},limit=${limit}`
	},
	dataSelector: {
		dataKey: "key-to-extract-data",
		valueKey: "value-key",
		textKey: "text-key",
	},
	onSelect: (value) => { doSomething(value) }
}

new Autocomlete(element, options)
```

### As additional improvements I would:
- write unit tests
- try to separate out some logic into reusable components, for example the debounce logic
- style the elements
- add more error handling to make the code more robust
