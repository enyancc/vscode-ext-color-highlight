'use strict';
import {
  workspace,
  window,
  Range,
  TextDocument,
  TextDocumentChangeEvent
} from 'vscode';
import { findRgba } from './strategies/rgba';
import { findHex } from './strategies/hex';
import { findWords } from './strategies/words';
import { DecorationMap } from './lib/decoration-map';

export class DocumentHighlight {

  /**
   * Creates an instance of DocumentHighlight.
   * @param {TextDocument} document
   * @param {any} viewConfig
   *
   * @memberOf DocumentHighlight
   */
  constructor(document, viewConfig) {
    this.disposed = false;

    this.document = document;
    this.strategies = [findHex, findRgba];

    if (viewConfig.matchWords) {
      this.strategies.push(findWords);
    }

    this.initialize(viewConfig);
  }

  initialize(viewConfig) {
    this.decorations = new DecorationMap(viewConfig);
    this.listner = workspace.onDidChangeTextDocument(({ document }) => this.onUpdate(document));
  }

  /**
   *
   * @param {TextDocumentChangeEvent} e
   *
   * @memberOf DocumentHighlight
   */
  onUpdate(document = this.document) {
    if (this.disposed || this.document.uri.toString() !== document.uri.toString()) {
      return;
    }

    const text = this.document.getText();
    const version = this.document.version.toString();

    return this.updateRange(text, version)
  }

  /**
   * @param {string} text
   * @param {string} version
   *
   * @memberOf DocumentHighlight
   */
  updateRange(text, version) {

    return Promise.all(this.strategies.map(fn => fn(text)))
      .then(result => {
        const actualVersion = this.document.version.toString();
        if (actualVersion !== version) {
          throw new Error('Document version already has changed');
        }

        return result;
      })
      .then(concatAll)
      .then(groupByColor)
      .then(colorRanges => {
        if (this.disposed) {
          return false;
        }

        const updateStack = this.decorations.keys()
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
          const decoration = this.decorations.get(color);

          window.visibleTextEditors
            .filter(({ document }) => document.uri === this.document.uri)
            .forEach(editor => editor.setDecorations(decoration, updateStack[color]));
        }
      }).catch(error => console.log(error));
  }

  dispose() {
    this.disposed = true;
    this.decorations.dispose();
    this.listner.dispose();

    this.decorations = null;
    this.document = null;
    this.colors = null;
    this.listner = null;

  }
}

function groupByColor(results) {
  return results
    .reduce((collection, item) => {
      if (!collection[item.color]) {
        collection[item.color] = [];
      }

      collection[item.color].push(item);

      return collection;
    }, {});
}

function concatAll(arr) {
  return arr.reduce((result, item) => result.concat(item), [])
}