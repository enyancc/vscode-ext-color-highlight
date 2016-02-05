'use strict';

const vscode = require('vscode');
const ColorHighlight = require('./lib/color-highlight');

const instances = {};

function activate (context) {
  vscode.window.visibleTextEditors.forEach((editor) => {
    getInstanceForDocument(context, editor.document)
      .triggerUpdate(editor);
  });

  vscode.window.onDidChangeActiveTextEditor(editor => {
    getInstanceForDocument(context, editor.document)
      .triggerUpdate(vscode.window.activeTextEditor);
  }, null, context.subscriptions);

  vscode.workspace.onDidChangeTextDocument(event => {
    const activeTextEditor = vscode.window.activeTextEditor;

    if (activeTextEditor && event.document === activeTextEditor.document) {
      getInstanceForDocument(context, activeTextEditor.document)
        .triggerUpdate(activeTextEditor);
    }
  }, null, context.subscriptions);

  vscode.workspace.onDidCloseTextDocument(document => {
    getInstanceForDocument(context, document)
      .dispose();

    instances[document.fileName] = null;
  }, null, context.subscriptions);
}

function deactivate () {}

module.exports = {
  activate,
  deactivate
};


function getInstanceForDocument (context, document, editor) {
  if (!instances[document.fileName]) {
    instances[document.fileName] = new ColorHighlight(vscode, document);
    instances[document.fileName].triggerUpdate(editor);

    if (context && context.subscriptions) {
      context.subscriptions.push(instances[document.fileName]);
    }
  }

  return instances[document.fileName];
}
