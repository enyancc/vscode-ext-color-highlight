const Color = require('color');
const webColors = require('color-name');

const customColors = {
  RED: '#EA5455',
  BLUE: '#4FCBFF',
  NIGHT: '#e5cdb3',
  GRAY_LV0: '#fff',
  GRAY_LV1: '#f9f9f9',
  GRAY_LV2: '#e3e3e3',
  GRAY_LV25: '#d2d2d2',
  GRAY_LV3: '#b7b7b7',
  GRAY_LV4: '#909090',
  GRAY_LV5: '#626262',
  GRAY_LV6: '#4e4e4e',
  GRAY_LV7: '#2E2E2E',
};

let preparedRePart = Object.keys(webColors)
  .map(color => `\\b${color}\\b`)
  .join('|');

 const customWord = ['RED',
  'BLUE',
  'NIGHT',
  'GRAY_LV0',
  'GRAY_LV1',
  'GRAY_LV2',
  'GRAY_LV25',
  'GRAY_LV3',
  'GRAY_LV4',
  'GRAY_LV5',
  'GRAY_LV6',
  'GRAY_LV7',]

  customWord.forEach((word,index,array)=>{
    preparedRePart = preparedRePart+'\\b'+word+'\\b';
    if (!index === array.length - 1){ 
      preparedRePart = preparedRePart + '|';
    }
  });

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
      let color = null;
      if (customWord.includes(matchedColor)){
        color = customColors[matchedColor];
      }else{
      color = Color(matchedColor)
        .rgb()
        .string();
      }
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