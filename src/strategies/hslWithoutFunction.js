import Color from 'color';

// Using [^\S\n] to avoid matching colors between lines. Using (?:;| |$) to avoid double matching with rgb() function
const colorHsl =
  /([.\d]{1,5})[^\S\n]*(?<commaOrSpace>[^\S\n]|,)[^\S\n]*([.\d]{1,5}%)[^\S\n]*\k<commaOrSpace>[^\S\n]*([.\d]{1,5}%)(?:;| |$)/g;

/**
 * @export
 * @param {string} text
 * @returns {{
 *  start: number,
 *  end: number,
 *  color: string
 * }}
 */
export async function findHslNoFn(text) {
  let match = colorHsl.exec(text);
  let result = [];

  while (match !== null) {
    const [matchedColor, hue, , saturation, lightness] = match;
    const start = match.index + (match[0].length - matchedColor.length);
    const end = colorHsl.lastIndex;

    try {
      const color = Color.hsl(
        parseInt(hue),
        parseInt(saturation),
        parseInt(lightness)
      ).string();

      result.push({
        start,
        end,
        color,
      });
    } catch (e) {
      console.error(e);
    }

    match = colorHsl.exec(text);
  }

  return result;
}
