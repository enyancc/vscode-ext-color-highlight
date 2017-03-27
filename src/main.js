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

  const disposable = vscode.commands
    .registerTextEditorCommand(COMMAND_NAME, (document) => {

      if (!document) {
        const { activeTextEditor } = vscode.window;
        document = activeTextEditor && activeTextEditor.document;
      }

      return findOrCreateInstance(document)
    });

  context.subscriptions.push(disposable);
  vscode.window.onDidChangeVisibleTextEditors(onOpenEditor);

  const { activeTextEditor } = vscode.window;

  if (activeTextEditor) {
    onOpenEditor([activeTextEditor]);
  }

  /**
   *
   * @param {vscode.TextEditor[]} editors
   */
  function onOpenEditor(editors) {

    // dispose all inactive editors
    if (!editors.length) {
      instanceMap.forEach(({ instance }) => instance.dispose());
      instanceMap = [];
    }


    // enable highlight in active editors
    editors.forEach(editor => {
      const { document } = editor;

      if (isValidDocument(config, document)) {
        vscode.commands.executeCommand(COMMAND_NAME, document)
      }
    });
  }
}

// this method is called when your extension is deactivated
export function deactivate() {
  instanceMap.forEach(({ instance }) => instance.dispose());
  instanceMap = null;
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

  if (config.languages.indexOf("*") > -1) {
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
 * @returns {{ instance: DocumentHighlight, document: vscode.TextDocument}}
 */
async function findOrCreateInstance(document) {
  if (!document) {
    return;
  }

  const found = instanceMap.find(({ document: refDoc }) => refDoc === document);

  if (!found) {
    const instance = new DocumentHighlight(document, config);
    instanceMap.push({
      document,
      instance
    })
  }

  return found || instanceMap[instanceMap.length - 1];
}