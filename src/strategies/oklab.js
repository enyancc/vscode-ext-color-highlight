import Color from "color";
import { converter } from "culori";

const colorOklab =
  /((oklab)\((((0+(\.\d+)?))|(1)|((100|0*\d{1,2})%)|(none))\s+(((-?0+(\.(40*|[0-3]\d*))?))|(1)|(-?(100|0*\d{1,2})%)|(none))\s+(((-?0+(\.(40*|[0-3]\d*))?))|(1)|((100|0*\d{1,2})%)|(none))(\s\/\s(((0+(\.\d+)?))|(1)|((100|0*\d{1,2})%)|(none)))?\))/gi;

/**
 * @export
 * @param {string} text
 * @returns {{
 *  start: number,
 *  end: number,
 *  color: string
 * }}
 */
export async function findOklab(text) {
  let match = colorOklab.exec(text);
  let result = [];

  while (match !== null) {
    const start = match.index;
    const end = colorOklab.lastIndex;
    const matchedColor = match[0];

    try {
      const oklabColor = converter("rgb")(matchedColor);
      const color = Color.rgb(
        oklabColor.r,
        oklabColor.g,
        oklabColor.b
      ).string();

      result.push({
        start,
        end,
        color,
      });
    } catch (e) {}

    match = colorOklab.exec(text);
  }

  return result;
}
