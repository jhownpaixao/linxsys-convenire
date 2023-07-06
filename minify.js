const minify = require('@node-minify/core');
const babelMinify = require('@node-minify/babel-minify');

minify({
  compressor: babelMinify,
  input: './build/server.js',
  output: './build/minify.js',
  callback: function (err, min) {}
});
