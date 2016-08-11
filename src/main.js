'use strict';

const vscode = require('vscode');
const ColorHighlight = require('./lib/color-highlight');

const state = {};

let config;
let context;

function activate (ctx) {
  config = vscode.workspace.getConfiguration('color-highlight');

  if (!config.enable) {
    config = null;
    return false;
  }

  context = ctx;

  const textEditorCommand = vscode.commands.registerTextEditorCommand('extension.colorHighlight', enable);

  vscode.window.onDidChangeActiveTextEditor(editor => enable(editor), null, context.subscriptions);
  vscode.workspace.onDidCloseTextDocument(disable, null, context.subscriptions);

  vscode.workspace.onDidChangeTextDocument(event => {
    const activeTextEditor = vscode.window.activeTextEditor;

    if (activeTextEditor && event && event.document === activeTextEditor.document) {
      enable(activeTextEditor);
    }
  }, null, context.subscriptions);


  enable(vscode.window.activeTextEditor);

  context.subscriptions.push(textEditorCommand);
}

function enable (editor, edit) {
  if (!editor) {
    return Promise.resolve(null);
  }

  return getInstanceForDocument(editor.document, !!edit)
    .then(instance => instance && instance.triggerUpdate());
}

function disable (document) {
  return getInstanceForDocument(document)
    .then(instance => {
      const fileName = instance && instance.document && instance.document.fileName;

      if (fileName) {
        instance && instance.dispose();
        state[fileName] = null;
      }
    });
}

function deactivate () {
  context = null;
  config = null;

  Object.keys(state).forEach(key => {
    if (state[key]) {
      state[key].dispose();
      state[key] = null;
    }
  });
}

module.exports = {
  activate,
  deactivate
};

function getInstanceForDocument(document, force) {
  const fileName = context && document && document.fileName;

  if (!fileName) {
    return Promise.resolve(null);
  }

  if (state[fileName] && state[fileName].disposed !== false) {
    return Promise.resolve(state[fileName]);
  }

  if ((filterDoc(document) || force) && (!state[fileName] || state[fileName].disposed))  {
    state[fileName] = new ColorHighlight(document, config);
  }

  return Promise.resolve(state[fileName]);
}

function filterDoc (document) {
  if (document && config) {
    return config.languages.indexOf(document.languageId) !== -1;
  }

  return false;
}
