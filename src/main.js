import vscode from 'vscode';
import { DocumentHighlight } from './color-highlight';

const COMMAND_NAME = 'extension.colorHighlight';
let instanceMap = null;
let config;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context) {
  instanceMap = [];
  config = vscode.workspace.getConfiguration('color-highlight');

  context.subscriptions.push(

    // vscode.commands.registerCommand('_' + COMMAND_NAME, doHighlight),
    vscode.commands.registerTextEditorCommand(COMMAND_NAME, runHighlightEditorCommand)

  );

  vscode.window.onDidChangeVisibleTextEditors(onOpenEditor, null, context.subscriptions);
  vscode.workspace
    .onDidChangeConfiguration(onConfigurationChange, null, context.subscriptions);

  onOpenEditor(vscode.window.visibleTextEditors);
}

// this method is called when your extension is deactivated
export function deactivate() {
  instanceMap.forEach((instance) => instance.dispose());
  instanceMap = null;
}

function reactivate() {
  deactivate();

  instanceMap = [];
  onOpenEditor(vscode.window.visibleTextEditors);
}

/**
 *  Checks if the document is applicable for autoHighlighighting
 *
 * @param {{languages: string[]}} config
 * @param {vscode.TextDocument} document
 * @returns
 */
function isValidDocument(config, { languageId }) {
  let isValid = false;

  if (!config.enable) {
    return isValid;
  }

  if (config.languages.indexOf('*') > -1) {
    isValid = true;
  }

  if (config.languages.indexOf(languageId) > -1) {
    isValid = true;
  }
  if (config.languages.indexOf(`!${languageId}`) > -1) {
    isValid = false;
  }

  return isValid;
}

/**
 * Finds relevant instance of the DocumentHighlighter or creates a new one
 *
 * @param {vscode.TextDocument} document
 * @returns {DocumentHighlight}
 */
async function findOrCreateInstance(document) {
  if (!document) {
    return;
  }

  const found = instanceMap.find(({ document: refDoc }) => refDoc === document);

  if (!found) {
    const instance = new DocumentHighlight(document, config);
    instanceMap.push(instance);
  }

  return found || instanceMap[instanceMap.length - 1];
}

async function runHighlightEditorCommand(editor, edit, document) {
  if (!document) {
    document = editor && editor.document;
  }

  return doHighlight([document]);
}

async function doHighlight(documents = []) {
  if (documents.length) {
    const instances = await Promise.all(documents.map(findOrCreateInstance));

    return instances.map(instance => instance.onUpdate());
  }
}

function onConfigurationChange() {
  config = vscode.workspace.getConfiguration('color-highlight');

  reactivate();
}

/**
 *
 * @param {vscode.TextEditor[]} editors
 */
function onOpenEditor(editors) {
  // dispose all inactive editors
  const documents = editors.map(({ document }) => document);
  const forDisposal = instanceMap.filter(({ document }) => documents.indexOf(document) === -1);

  instanceMap = instanceMap.filter(({ document }) => documents.indexOf(document) > -1);
  forDisposal.forEach(instance => instance.dispose());

  // enable highlight in active editors
  const validDocuments = documents.filter(doc => isValidDocument(config, doc));

  doHighlight(validDocuments);
}
