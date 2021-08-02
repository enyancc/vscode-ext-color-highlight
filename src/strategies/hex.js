import Color from 'color';

const colorHex = /.?((\#|\b0x)([a-f0-9]{6}([a-f0-9]{2})?|[a-f0-9]{3}([a-f0-9]{1})?))\b/gi;

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
    const firstChar = match[0][0];
    const matchedColor = match[1];
    const colorPrefix = match[2];
    const hexChars = match[3];

    const matchedHex = '#' + hexChars;
    const start = match.index + (match[0].length - matchedColor.length);
    const end = colorHex.lastIndex;

    // We skip the match in the following cases:
    // 1. If the symbol before the `#` (exists and) is a letter, to try to avoid
    //    coloring in the contexts that are not relevant (such as inside a URL).
    //    https://github.com/sergiirocks/vscode-ext-color-highlight/issues/25
    const notRelevant = firstChar.length && /\w/.test(firstChar);
    // 2. If the color is a numeric hex color, and it is only 3 or 4 characters
    //    (e.g. `0xHHH` or `0xHHHH`), as these are *far* more likely to be
    //    normal hexadecimal number literals, which do not represent a color.
    const isShortNumeric = /0x/i.test(colorPrefix) && hexChars.length <= 4;

    if (notRelevant || isShortNumeric) {
      match = colorHex.exec(text);
      continue;
    }

    try {
      const color = Color(matchedHex)
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
