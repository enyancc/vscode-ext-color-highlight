'use strict';
const colorFinder = require('./color-finder');

class ColorHighlight {

  constructor (vscode, document, editor) {
    this.vscode = vscode;
    this.window = vscode.window;

    this.document = document;

    this.colors = {};
    this.decorations = [];

    if (editor) {
      this.update(editor);
    }
  }

  /**
   * @param {TextEditor} editor
   */
  update (editor) {
    if (!editor || !editor.document || editor.document.fileName !== this.document.fileName) {
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
            return new this.vscode.Range(
              this.document.positionAt(item.start),
              this.document.positionAt(item.end)
            );
          });
        }

        for (const color in updateStack) {
          editor.setDecorations(this.getColorDecoration(color), updateStack[color]);
        }
      }).catch(error => console.log(error));
  }

  getColorDecoration (color) {
    if (!this.colors[color]) {
      this.colors[color] = this.window.createTextEditorDecorationType({
        overviewRulerColor: color,
        borderColor: color,
        borderStyle: 'solid',
        borderWidth: '3px'
      });
    }

    return this.colors[color];
  }

  triggerUpdate (activeEditor) {
    this.cancelUpdate();
    this.updateTimeout = setTimeout(() => this.update(activeEditor), 500);
  }

  cancelUpdate () {
    clearTimeout(this.updateTimeout);
  }

  dispose () {
    // TODO: dispose ()
    if (this.disposed) {
      return;
    }

    for (const i in this.colors) {
      this.colors[i].dispose();
    }

    this.cancelUpdate();
    this.document = null;
    this.vscode = null;
    this.window = null;

    this.colors = null;
    this.decorations = null;

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
