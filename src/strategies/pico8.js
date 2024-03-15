import Color from 'color';

const gfxSection = /^__gfx__((?:\n|.)*?)^__/m;
const pico8Color = /[a-f0-9]/g;

// https://pico-8.fandom.com/wiki/Palette
const palette = {
  "0": "#000000",
  "1": "#1D2B53",
  "2": "#7E2553",
  "3": "#008751",
  "4": "#AB5236",
  "5": "#5F574F",
  "6": "#C2C3C7",
  "7": "#FFF1E8",
  "8": "#FF004D",
  "9": "#FFA300",
  "a": "#FFEC27",
  "b": "#00E436",
  "c": "#29ADFF",
  "d": "#83769C",
  "e": "#FF77A8",
  "f": "#FFCCAA"
};

/**
 * @export
 * @param {string} text
 * @returns {{
 *  start: number,
 *  end: number,
 *  color: string
 * }}
 */
export async function findPico8Color(text) {
  let gfxMatch = text.match(gfxSection);
  if (!gfxMatch) {
    return [];
  }
  let gfxOffset = gfxMatch.index + 7;
  let colorText = gfxMatch[1];

  let match = pico8Color.exec(colorText);
  let result = [];

  while (match !== null) {
    const colorindex = match[0];
    const start = gfxOffset + match.index;
    const end = start + 1;

    try {
      const color = Color(palette[colorindex])
        .rgb()
        .string();

      result.push({
        start,
        end,
        color
      });
    } catch (e) { }

    match = pico8Color.exec(colorText);
  }

  return result;
}
