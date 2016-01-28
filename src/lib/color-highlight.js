'use strict';
const vscode = require('vscode');

const colorFinder = require('./color-finder');

let triggerTimeout = null;
let activeEditor = null;
let decorationsHash = [];
let decorationsByLine = {};

module.exports = {
  activate: activate,
  deactivate: deactivate
};

function activate (context) {
  activeEditor = vscode.window.activeTextEditor;

  vscode.window.onDidChangeActiveTextEditor(editor => {
    activeEditor = editor;
    cleanDecorations();
    triggerUpdateDecorations();
  }, null, context.subscriptions);

  vscode.workspace.onDidChangeTextDocument(event => {
    if (activeEditor && event.document === activeEditor.document) {
      triggerUpdateDecorations(event);
    }
  }, null, context.subscriptions);

  vscode.workspace.onDidOpenTextDocument(event => {
    cleanDecorations();
    triggerUpdateDecorations();
  }, null, context.subscriptions);

  triggerUpdateDecorations();
}


function deactivate () {
  cleanDecorations();
}


function triggerUpdateDecorations (event) {
  if (event && event.contentChanges) {
    event.contentChanges.forEach(change => {
      const changeRange = change.range;
      const decorations = decorationsByLine[changeRange.start.line]

      if (decorations) {
        decorations.forEach(item => {
          if (item.range.contains(changeRange) || item.range.start.isEqual(changeRange.start)) {
            item.rangeDecoration.dispose();
            decorationsHash.splice(decorationsHash.indexOf(item), 1);
          }
        });
      }
    });
  }

  if (triggerTimeout) {
    clearTimeout(triggerTimeout);
  }
  triggerTimeout = setTimeout(updateDecorations, 500);
}

function updateDecorations () {

  const currentEditor = activeEditor;
  if (!currentEditor) {
    return;
  }

  colorFinder
    .findAll(currentEditor.document.getText())
    .then(colorRanges => {
      const currentState = {};

      decorationsByLine = [];
      decorationsHash.forEach(item => {
        currentState[getKeyFromRange(item.range, item.color)] = item;
        item.found = false;
      });

      for (let i = 0, l = colorRanges.length; i < l; i++) {
        const item = colorRanges[i];

        const start = currentEditor.document.positionAt(item.start);
        const end = currentEditor.document.positionAt(item.end);
        const color = item.color;

        const range = new vscode.Range(start, end);

        const key = getKeyFromRange(range);

        if (currentState[key]) {
          currentState[key].found = true;

          continue;
        }

        const rangeDecoration = vscode.window.createTextEditorDecorationType({
          overviewRulerColor: color,
          borderColor: color,
          borderStyle: 'solid',
          borderWidth: '3px'
        });

        const record = {
          key,
          color,
          range,
          rangeDecoration
        };

        decorationsHash.push(record);
        decorationsByLine[range.start.line] = decorationsByLine[range.start.line] || [];
        decorationsByLine[range.start.line].push(record);

        setTimeout(() => {
          currentEditor && currentEditor.setDecorations(rangeDecoration, [ range ]);
        }, 10 * i);
      }

      const keys = Object.keys(currentState);

      for (let i = keys.length; i > 0; --i) {
        const key = keys[i];
        if (currentState[key] && currentState[key].found === false) {
          currentState[key].rangeDecoration.dispose();
          decorationsHash.splice(decorationsHash.indexOf(currentState[key]), 1);
        }
      }
    });

  return;
}

function getKeyFromRange (range) {
  return `${range.start.line}:${range.start.character}` +
      `-${range.end.line}:${range.end.character}`;
}

function cleanDecorations () {
  for (let i = decorationsHash.length; i > 0; --i) {
    if (decorationsHash[i] && decorationsHash[i].dispose) {
      decorationsHash[i].dispose();
      decorationsHash[i] = null;
    }
  }
  decorationsHash = [];
  decorationsByLine = {};
}
