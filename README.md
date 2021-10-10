# DigiExam Frontend Take-home Exercise copied from Frame.io

The original exercise is not available anymore at Frame.io.
This repository has been copied from https://github.com/SJaved0327/frontend-exercise-public/tree/bd4c3a52a82d4e21b0bca876a3f2bcc5ec70f746

Hi there! Here is a coding exercise to help us assess your technical skills.
Please plan to spend no more than 4 hours on this. We understand we may not be
the only company asking for an exercise from you and want to be respectful of
your time. The test is designed for all levels, and you could spend much longer
perfecting your solution if you wanted to. We recommend you focus on the core
requirements first, then work on any additional features if you have the time.

By 4 hours in, please feel free to stop working and explain what refactors /
code organization / enhancements you would have made with more time in the
SOLUTION.md file.

If you have any questions at any point during the exercise, please reach out to
me at pierre.killy@digiexam.com

## Submission

1. Clone this repository.

2. Commit all your changes locally.

3. When you're done, zip the repository (include `.git`, exclude `node_modules`) and email it to me.
Build your email as if you were building a PR.

## Overview

This is a simple Autocomplete/Typeahead component in vanilla ES2015 that
lets you type in a query and shows a list of matching results in a dropdown,
just like how Google's search box works.

To see this component in action, let's set up the repo:

1. Run `npm install`
2. Run `npm start` (runs `webpack-dev-server`)
3. Open `http://localhost:8080` on your browser.

Type "new" in the input, and you'll get a list of matching US states that start
with "new".


## Task

Currently, the component can only query against a static data array and only
works with mouse clicks. Your task is to:

1. Enhance the component so that it also accepts an HTTP endpoint as data source.

    For example, if you wire up the component to
    `https://api.github.com/search/users?q={query}&per_page=${numOfResults}`,
    and if you type `foo` in the input, the component dropdown should show
    Github users with logins that start with `foo`. When you select a user from
    the results, `item` in the `onSelect(item)` callback should be the selected
    Github user's id.

    (The enhanced component only needs to work with either a data array or a
    HTTP source, not both.)

2. Implement keyboard shortcuts to navigate the results dropdown using up/down
   arrow keys and to select a result using the Enter key.

Uncomment the relevant sections in `index.js` and `index.html` to implement a
demo that looks like this:

![Demo example screenshot](demo-example.png)


## Requirements

- The component should be reusable. It should be possible to have multiple
  instances of the component on the same page.
- The "States" example that uses a data array should continue to work.
- The component should accept any HTTP endpoint, not just the
  `https://api.github.com/users` example above.
- Your component should work correctly in Chrome, don’t worry about
  cross-browser compatibility.
- You can use small DOM helpers like jQuery or utilities from Lodash, but not
  larger libraries/frameworks like React, Angular or Vue.js
- You don't need to preserve any of the existing code; feel free to modify them
  as you wish.
- New APIs should be documented in `SOLUTION.md`.
