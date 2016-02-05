'use strict';
const window = require('vscode').window;
const Range = require('vscode').Range;

const colorFinder = require('./color-finder');

class ColorHighlight {

  constructor (document) {
    this.document = document;

    this.colors = {};
    this.decorations = [];
  }

  update () {
    if (this.disposed) {
      return;
    }

    const activeEditorFileName = window.activeTextEditor &&
      window.activeTextEditor.document &&
      window.activeTextEditor.document.fileName;

    const currentDocumentFileName = this.document && this.document.fileName;

    if (currentDocumentFileName && activeEditorFileName !== currentDocumentFileName) {
      return;
    }

    colorFinder
      .findAll(this.document.getText())
      .then(processColorFinderResults)
      .then(colorRanges => {
        const updateStack = Object.keys(this.colors)
          .reduce((state, color) => {
            state[color] = [];
            return state;
          }, {});

        for (const color in colorRanges) {
          updateStack[color] = colorRanges[color].map(item => {
            return new Range(
              this.document.positionAt(item.start),
              this.document.positionAt(item.end)
            );
          });
        }

        for (const color in updateStack) {
          window.activeTextEditor.setDecorations(this.getColorDecoration(color), updateStack[color]);
        }
      }).catch(error => console.log(error));
  }

  getColorDecoration (color) {
    if (!this.colors[color]) {
      this.colors[color] = window.createTextEditorDecorationType({
        overviewRulerColor: color,
        borderColor: color,
        borderStyle: 'solid',
        borderWidth: '3px'
      });
    }

    return this.colors[color];
  }

  triggerUpdate () {
    this.cancelUpdate();
    this.updateTimeout = setTimeout(() => {
      this.update();
    }, 500);

    return Promise.resolve();
  }

  cancelUpdate () {
    clearTimeout(this.updateTimeout);
  }

  dispose () {
    // TODO: dispose ()
    if (this.disposed) {
      return;
    }

    this.cancelUpdate();

    for (const i in this.colors) {
      this.colors[i].dispose();
    }

    this.decorations = null;
    this.document = null;
    this.colors = null;

    this.disposed = true;
  }
}

function processColorFinderResults (results) {

  return results.reduce((collection, item) => {
    if (!collection[item.color]) {
      collection[item.color] = [];
    }

    collection[item.color].push(item);

    return collection;
  }, {});
}

module.exports = ColorHighlight;
