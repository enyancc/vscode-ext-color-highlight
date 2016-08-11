'use strict';
const Color = require('color');
const webColors = require('color-name');

const preparedRePart = Object.keys(webColors)
  .map(color => '\\b' + color + '\\b')
  .join('|');

const colorWeb = new RegExp('\\(' + preparedRePart + '\\)', 'g');
const colorHex = /(\#([a-f0-9]{6}|[a-f0-9]{3}))/gi;
const colorRgba = /(rgba?\([\d]{1,3},\s*[\d]{1,3},\s*[\d]{1,3}(,\s*\d?\.?\d)?\))/gi;

module.exports = {
  findAll: findAll
};

function findAll (text, matchWords) {
  return Promise.all([
    findAllRegex(colorRgba, text),
    findAllRegex(colorHex, text),
    matchWords ? findAllRegex(colorWeb, text) : Promise.resolve([])
  ]).then(data => {
    let results = [];

    data.forEach(item => results = results.concat(item));

    return results;
  });
}

function findAllRegex (expr, text) {
  return new Promise((resolve, reject) => {
    let match = expr.exec(text);
    let result = [];

    while (match !== null) {
      const start = match.index;
      const end = expr.lastIndex;

      let color;

      try {
        color = Color(match[0]).rgbaString();
        result.push({
          start,
          end,
          color
        });
      } catch (e) {}

      match = expr.exec(text);
    }

    resolve(result);
  });
}

