import Color from 'color';

const colorHex =
  /.?((?:\#|\b0x)([a-f0-9]{6}([a-f0-9]{2})?|[a-f0-9]{3}([a-f0-9]{1})?))\b/gi;

const colorHex3 =
  /.?((?:\#|\b0x)([a-f0-9]{6}|[a-f0-9]{3}))\b/gi;

const colorHex4 =
  /.?((?:\#|\b0x)([a-f0-9]{8}|[a-f0-9]{4}))\b/gi;

/**
 * @export
 * @param {string} text
 * @returns {{
 *  start: number,
 *  end: number,
 *  color: string
 * }}
 */
function findHex(text, useARGB, matchHEX3, matchHEX4) {
  if (matchHEX3 == false && matchHEX4 == false) {
    return [];
  }

  let reHex;
  if (matchHEX3 == true && matchHEX4 == true) {
    reHex = colorHex;
  }
  if (matchHEX3 == true) {
    reHex = colorHex3;
  }
  else {
    reHex = colorHex4;
  }
  let match = reHex.exec(text);
  let result = [];

  while (match !== null) {
    const firstChar = match[0][0];
    const matchedColor = match[1];
    const start = match.index + (match[0].length - matchedColor.length);
    const end = reHex.lastIndex;
    let matchedHex = '#' + match[2];

    // Check the symbol before the color match, and try to avoid coloring in the
    // contexts that are not relevant
    // https://github.com/sergiirocks/vscode-ext-color-highlight/issues/25
    if (firstChar.length && /\w/.test(firstChar)) {
      match = reHex.exec(text);
      continue;
    }

    try {
      let color;
      if (useARGB == true) {
        let alphaInt = 1;
        if (match[2].length == 8) {
          alphaInt =
            Math.round((parseInt(match[2].substring(0, 2), 16) * 100) / 255) /
            100; // Get first 2 characters, convert to decimal
          matchedHex = '#' + match[2].substring(2);
        }

        color = Color(matchedHex).alpha(alphaInt).rgb().string();
      } else {
        color = Color(matchedHex).rgb().string();
      }

      result.push({
        start,
        end,
        color,
      });
    } catch (e) {}

    match = reHex.exec(text);
  }

  return result;
}

/**
 * @export
 * @param {string} text
 * @returns {{
 *  start: number,
 *  end: number,
 *  color: string
 * }}
 */
export async function findHexARGB(text, matchHEX3 = true, matchHEX4 = true) {
  return findHex(text, true, matchHEX3, matchHEX4);
}

/**
 * @export
 * @param {string} text
 * @returns {{
 *  start: number,
 *  end: number,
 *  color: string
 * }}
 */
export async function findHexRGBA(text, matchHEX3 = true, matchHEX4 = true) {
  return findHex(text, false, matchHEX3, matchHEX4);
}
