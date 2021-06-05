import Color from 'color';

const colorRgb = /(\d{1,3})((?:,\s?)|\s)(\d{1,3})\2(\d{1,3})/g;

/**
 * @export
 * @param {string} text
 * @returns {{
 *  start: number,
 *  end: number,
 *  color: string
 * }}
 */
export async function findRgbNoFn(text) {
  let match = colorRgb.exec(text);
  let result = [];

  while (match !== null) {
    const [matchedColor, red, , green, blue] = match;
    const start = match.index + (match[0].length - matchedColor.length);
    const end = colorRgb.lastIndex;

    try {
      const color = Color.rgb(
        parseInt(red),
        parseInt(green),
        parseInt(blue)
      ).string();

      result.push({
        start,
        end,
        color
      });
    } catch (e) {
      console.error(e)
    }

    match = colorRgb.exec(text);
  }

  return result;
}
