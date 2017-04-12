const Color = require('color');

const colorRgba = /(rgba?\([\d]{1,3},\s*[\d]{1,3},\s*[\d]{1,3}(,\s*\d?\.?\d)?\))/gi;

/**
 * @export
 * @param {string} text
 * @returns {{
 *  start: number,
 *  end: number,
 *  color: string
 * }}
 */
export async function findRgba(text) {
  let match = colorRgba.exec(text);
  let result = [];

  while (match !== null) {
    const start = match.index;
    const end = colorRgba.lastIndex;
    const color = match[0];

    result.push({
      start,
      end,
      color
    });

    match = colorRgba.exec(text);
  }

  return result;
}