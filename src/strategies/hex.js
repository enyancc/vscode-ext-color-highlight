import Color from 'color';

const colorHex = /.?(\#([a-f0-9]{6}([a-f0-9]{2})?|[a-f0-9]{3}([a-f0-9]{1})?))\b/gi;

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
    const matchedColor = match[1];

    const contextChar = match[0][0];

    // Check the symbol before the color match, and try to avoid coloring in the
    // contexts that are not relevant
    // https://github.com/sergiirocks/vscode-ext-color-highlight/issues/25
    if (contextChar.length && /\w/.test(contextChar)) {
      match = colorHex.exec(text);
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

    match = colorHex.exec(text);
  }

  return result;
}