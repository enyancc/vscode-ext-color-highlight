const Color = require('color');
const webColors = require('color-name');

const preparedRePart = Object.keys(webColors)
  .map(color => `\\b${color}\\b`)
  .join('|');

const colorWeb = new RegExp('\\(' + preparedRePart + '\\)', 'g');

/**
 * @export
 * @param {string} text
 * @returns {{
 *  start: number,
 *  end: number,
 *  color: string
 * }}
 */
export async function findWords(text) {
  let match = colorWeb.exec(text);
  let result = [];

  while (match !== null) {
    const start = match.index;
    const end = colorWeb.lastIndex;
    const matchedColor = match[0];

    try {
      const color = Color(matchedColor)
        .rgb()
        .string();

      result.push({
        start,
        end,
        color
      });
    } catch (e) { }

    match = colorWeb.exec(text);
  }

  return result;
}