import Color from 'color';
import webColors from 'color-name';

const preparedRePart = Object.keys(webColors)
  .map(color => `\\b${color}\\b`)
  .join('|');

const colorWeb = new RegExp('.?(' + preparedRePart + ')(?!-)', 'g');

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
    const firstChar = match[0][0];
    const matchedColor = match[1];
    const start = match.index + (match[0].length - matchedColor.length);
    const end = colorWeb.lastIndex;

    if (firstChar.length && /[-\\$@#]/.test(firstChar)) {
      match = colorWeb.exec(text);
      continue;
    }

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
