const ANSI_COLOR_REGEX = /\\x1b\[(?<i>\d+)m[^'|"]+/gi;
const UNICODE_ANSI_REGEX = /\\u001b\[(?<i>\d+)+m[^'|"]+/gi;

const ANSI_COLOR_MAP = {
  0: "",
  // bold
  1: "",
  // Italic
  3: "",
  // Underline
  4: "",

  30: "rgb(0, 0, 0)",
  31: "rgb(128, 0, 0)",
  32: "rgb(0, 128, 0)",
  33: "rgb(128, 128, 0)",
  34: "rgb(0, 0, 128)",
  35: "rgb(128, 0, 128)",
  36: "rgb(0, 128, 128)",
  37: "rgb(192, 192, 192)",
  40: "rgb(0, 0, 0)",
  41: "rgb(128, 0, 0)",
  42: "rgb(0, 128, 0)",
  43: "rgb(128, 128, 0)",
  44: "rgb(0, 0, 128)",
  45: "rgb(128, 0, 128)",
  46: "rgb(0, 128, 128)",
  47: "rgb(192, 192, 192)",
  90: "rgb(128, 128, 128)",
  91: "rgb(255, 0, 0)",
  92: "rgb(0, 255, 0)",
  93: "rgb(255, 255, 0)",
  94: "rgb(0, 0, 255)",
  95: "rgb(255, 0, 255)",
  96: "rgb(0, 255, 255)",
  97: "rgb(255, 255, 255)",
  100: "rgb(0, 0, 0)",
  101: "rgb(128, 0, 0)",
  102: "rgb(0, 128, 0)",
  103: "rgb(128, 128, 0)",
  104: "rgb(0, 0, 128)",
  105: "rgb(128, 0, 128)",
  106: "rgb(0, 128, 128)",
  107: "rgb(192, 192, 192)",
};

function runStrategy(regexs, text) {
  for (const regex of regexs) {
    const match = regex.exec(text);

    if (match) {
      return match;
    }
  }

  return null;
}

export function findAnsi4Color(text) {
  let match = runStrategy([ANSI_COLOR_REGEX, UNICODE_ANSI_REGEX], text);
  const result = [];

  while (match !== null) {
    const ansiStr = match[0].toLowerCase();
    const start = match.index;
    const end = start + ansiStr.length;
    const i = parseInt(match.groups.i, 10);

    result.push({
      color: ANSI_COLOR_MAP[i],
      start,
      end,
    });

    match = runStrategy([ANSI_COLOR_REGEX, UNICODE_ANSI_REGEX], text);
  }

  return result;
}
