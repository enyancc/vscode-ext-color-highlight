'use strict';
const Color = require('color');
const webColors = require('css-color-names');


const preparedRePart = Object.keys(webColors)
  .map(color => '\\b' + color + '\\b')
  .join('|');

const colorWeb = new RegExp('\\(' + preparedRePart + '\\)', 'g');
const colorHexRe = /(\#([a-f0-9]{6}|[a-f0-9]{3}))/gi;
const colorRgba = /(rgba?\([\d]{1,3},\s*[\d]{1,3},\s*[\d]{1,3}(,\s*\d?\.?\d)?\))/gi;

module.exports = {
  findAll: findAll
};


function findAll (text) {
  return Promise.all([
    findAllHex(text),
    findAllRgba(text),
    findLiteralColors(text)
  ]).then(data => {
    let results = [];

    data.forEach(item => results = results.concat(item));

    return results;
  });
}

function findLiteralColors (text) {
  return new Promise((resolve, reject) => {
    let match = colorWeb.exec(text);
    let result = [];

    while (match !== null) {
      const start = match.index;
      const end = colorWeb.lastIndex;

      let color;

      try {
        color = Color(webColors[match[0]]).rgbaString();
        result.push({
          start,
          end,
          color
        });
      } catch (e) {}

      match = colorWeb.exec(text);
    }

    resolve(result);
  });
}

function findAllHex (text) {
  return new Promise((resolve, reject) => {
    let match = colorHexRe.exec(text);
    let result = [];

    while (match !== null) {
      const start = match.index;
      const end = colorHexRe.lastIndex;

      let color;

      try {
        color = Color(match[0]).rgbaString();
        result.push({
          start,
          end,
          color
        });
      } catch (e) {}

      match = colorHexRe.exec(text);
    }


    resolve(result);
  });
}


function findAllRgba (text) {
  return new Promise((resolve, reject) => {
    let match = colorRgba.exec(text);
    let result = [];

    while (match !== null) {
      const start = match.index;
      const end = colorRgba.lastIndex;

      let color;

      try {
        color = Color(match[0]).hexString();
        result.push({
          start,
          end,
          color
        });
      } catch (e) {}

      match = colorRgba.exec(text);
    }


    resolve(result);
  });
}
