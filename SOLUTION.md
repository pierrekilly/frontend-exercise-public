# Solution Docs

The application consists of one main page which contains 2 search input fields, one to search and select US state, another one - GitHub users.

The application has the following file structure:

```
project
│   .gitignore
│   demo-example.png
│   index.html
│   LICENSE
│   package.json
│   README.md
│   SOLUTION.md
│   webpack.config.js
│
└───src
    │   index.js
    │   main.css
    │
    └───components
    │   │   Autocomplete.js
    │   │   GihubUsers.js
    │   │   States.js
    │   └───
    │
    │
    └───data
    │   │   us-states.json
    │   └───
    │
    │
    └───providers
    │   │   AsyncDataProvider.js
    │   │   DataProvider.js
    │   │   SourceProvider.js
    │   └───
    │   
    │ 
    └───uiHelpers  
        │   index.js
        └───
```


For each search field, there is a corresponding component in the `src/components` directory. Each search field uses `Autocomplete` component, which is a reusable component that allows rendering an input field that will show select options dropdown based on the typed value and select one of the options.
The main difference between `states` and `github users` select fields is that we are receiving the `state` options by using a synchronous data provider, and async one for the `github users`. To receive data by using either async or sync ways, we are using the providers from the `src/providers` directory. 
We have there a `SourceProvider` abstract class, which shouldn't be used, it's an abstraction of how the provider classes should look like and what methods should they have. Based on the `SourceProvider` class we have crated 2 providers - `DataProvider` and `AsyncDataProvider`. `DataProvider` is for getting data
based on the query value synchronously. It receives the whole data list in the `constructor` and then making a filter based on the query value. The `AsyncDataProvider` is for getting data based on the query value by using an HTTP endpoint and fetching data from the provided url. `States` component uses `DataProvider` 
and the whole list of states it is taking from the `src/data/us-states.json` file. The `GithubUsers` component uses an API to fetch users data from the Github server based on the query value and as that process is asynchronous, we are using here `AsyncDataProvider`.

### The things that can be improved if we spend more time on the task:

- UI and UX - there is a huge space to improve both - UI and UX, mainly the styles had been applied to have correct positions for the elements, and show some small changes in some user events, like hovering of the list option.
- Error messages - now if some error occurs during the search, especially in case of fetching data from an API, we are not rendering any message about that. Will be good to catch those errors, show some user friendly message to let the user know that something went wrong, so they would know why there are no options rendered.
- In case of more time, the way we handle the data getting process and the way we are using data providers can be improved. Now we are using the corresponding data provider in each component (`States`, `GithubUsers`) and handling the `getData` processes in the components. It would be more accurate if the `Autocomplete` component handles all of those things, so `States` and `GithubUsers` components don't care and don't know anything about data providers, they just should pass a data array or URL for the fetch, and probably couple of more information (like query params, page size, etc.) and the rest should be handled by the `Autocomplete` component.
- The application uses webpack 2.6.1, which is an old one, I would upgrade it, to have the benefits the new webpack gives, but in this small task the difference wouldn't be much, that's why I haven't prioritized it.
