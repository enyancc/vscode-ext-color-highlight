import Color from 'color';

const colorHex = /(\#([a-f0-9]{6}([a-f0-9]{2})?|[a-f0-9]{3}([a-f0-9]{1})?))\b/gi;

/**
 * @export
 * @param {string} text
 * @returns {{
 *  start: number,
 *  end: number,
 *  color: string
 * }}
 */
export async function findHex(text) {
  let match = colorHex.exec(text);
  let result = [];

  while (match !== null) {
    const start = match.index;
    const end = colorHex.lastIndex;
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

    match = colorHex.exec(text);
  }

  return result;
}