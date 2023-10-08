import Color from "color";
import { converter } from "culori";

const colorOklch =
  /((oklch)\((((0+(\.\d+)?))|(1)|((100|0*\d{1,2})%)|(none))\s+(((0+(\.\d+)?))|(1)|((100|0*\d{1,2})%)|(none))\s+(-?\d+(\.\d+)?(deg|rad|grad|turn)?)(\s\/\s(((0+(\.\d+)?))|(1)|((100|0*\d{1,2})%)|(none)))?\))/gi;

/**
 * @export
 * @param {string} text
 * @returns {{
 *  start: number,
 *  end: number,
 *  color: string
 * }}
 */
export async function findOklch(text) {
  let match = colorOklch.exec(text);
  let result = [];

  while (match !== null) {
    const start = match.index;
    const end = colorOklch.lastIndex;
    const matchedColor = match[0];

    try {
      const oklchColor = converter("rgb")(matchedColor);
      const color = Color.rgb(
        oklchColor.r,
        oklchColor.g,
        oklchColor.b
      ).string();

      result.push({
        start,
        end,
        color,
      });
    } catch (e) {}

    match = colorOklch.exec(text);
  }

  return result;
}
