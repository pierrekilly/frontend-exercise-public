const path = require('path');
const outputPath = path.resolve(__dirname, 'dist');
const pokemonList = require("./pokemon-list.json");

module.exports = {
  entry: {
    bundle: './index.js'
  },

  output: {
    path: outputPath,
    publicPath: '/dist/',
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          query: { cacheDirectory: true },
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ],
      },
    ],
  },

  devServer: {
    publicPath: '/dist/',
    before: function(app) {
      app.get("/api/pokemon", function(req, res) {
        let matchingPokemons = []
        pokemonList.forEach(pokemon => {
          pokemon.name.toLowerCase().includes(req.query.name.toLowerCase()) ? matchingPokemons.push(pokemon) : null;
        })

        res.json(matchingPokemons);
      });
    },
    open: true
  },

  devtool: 'cheap-module-source-map',
};
