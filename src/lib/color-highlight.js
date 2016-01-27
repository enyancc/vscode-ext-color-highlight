'use strict';
const vscode = require('vscode');
const debounce = require('debounce');

const colorFinder = require('./color-finder');

let decorations = [];

module.exports = {
  activate: activate,
  deactivate: function () {}
};

function activate (context) {
  if (vscode.window.activeTextEditor) {
    addColorHighlight(vscode.window.activeTextEditor);
  }
  // call on all active editors first
  vscode.window.onDidChangeActiveTextEditor(addColorHighlight);

  vscode.workspace.onDidChangeTextDocument(debounce(() => {
    addColorHighlight(vscode.window.activeTextEditor);
  }, 500));
}



function addColorHighlight (editor) {
  if (!editor) {
    return;
  }

  decorations.forEach(decoration => decoration.dispose());
  decorations = [];

  colorFinder
    .findAll(editor.document.getText())
    .then(colorRanges => {
      colorRanges.forEach((item) => {
        const start = editor.document.positionAt(item.start);
        const end = editor.document.positionAt(item.end);

        const range = new vscode.Range(start, end);

        const decoration = vscode.window.createTextEditorDecorationType({
          overviewRulerColor: item.color,
          borderColor: item.color,
          borderStyle: 'solid',
          borderWidth: '3px'
        });

        decorations.push(decoration);

        editor.setDecorations(decoration, [range]);
      });
    });

  return;
}


