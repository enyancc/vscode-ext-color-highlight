'use strict';
import vscode from 'vscode';
import { getColorContrast } from './dynamic-contrast';

/**
 *
 * @export
 * @class DecorationMap
 *
 * @property {{
 *  markRuler: boolean,
 *  markerType: string
 * }} options
 */
export class DecorationMap {
  /**
   * Creates an instance of DecorationMap.
   * @param {{
   *  markRuler: boolean,
   *  markerType: string
   * }} options
   *
   * @memberOf DecorationMap
   */
  constructor(options) {
    this.options = Object.assign({}, options);
    this._map = new Map();
    this._keys = [];
  }

  /**
   * @param {string} color
   * @returns vscode.TextEditorDecorationType
   */
  get(color) {
    if (!this._map.has(color)) {
      let rules = {};
      if (this.options.markRuler) {
        rules = {
          overviewRulerColor: color
        };
      }

      switch (this.options.markerType) {
        case 'outline':
          rules.border = `3px solid ${color}`;
          break;
        case 'foreground':
          rules.color = color;
          break;
        case 'underline':
          rules.color = 'invalid; border-bottom:solid 2px ' + color;
          break;
        case 'dot':
        case 'dotafter':
        case 'dot-after':
        case 'dot_after':
          rules.after = {
            contentText: ' ',
            margin: '0.1em 0.2em 0 0.2em',
            width: '0.7em',
            height: '0.7em',
            backgroundColor: color,
            borderRadius: '50%'
          };
          break;
        case 'dotbefore':
        case 'dot-before':
        case 'dot_before':
          rules.before = {
            contentText: ' ',
            margin: '0.1em 0.2em 0 0.2em',
            width: '0.7em',
            height: '0.7em',
            backgroundColor: color,
            borderRadius: '50%'
          };
          break;
        case 'background':
        default:
          rules.backgroundColor = color;
          rules.color = getColorContrast(color);
          rules.border = `3px solid ${color}`;
          rules.borderRadius = '3px';
      }
      this._map.set(color, vscode.window.createTextEditorDecorationType(rules));
      this._keys.push(color);
    }
    return this._map.get(color);
  }


  keys() {
    return this._keys.slice();
  }

  dispose() {
    this._map.forEach((decoration) => {
      decoration.dispose();
    });
  }
}
