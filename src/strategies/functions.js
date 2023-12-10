const colorRegex = /((rgb|hsl|lch|oklch)a?\(\s*[\d]*\.?[\d]+%?\s*(?<commaOrSpace>\s|,)\s*[\d]*\.?[\d]+%?\s*\k<commaOrSpace>\s*[\d]*\.?[\d]+%?(\s*(\k<commaOrSpace>|\/)\s*[\d]*\.?[\d]+%?)?\s*\))/gi;
const cssVarRegex = /(--[\w-]+-(rgb|hsl|lch|oklch)):\s*([\d]*\.?[\d]+\s+[\d]*\.?[\d]+\s+[\d]*\.?[\d]+);/gi;
const allowedColorFunctions = ['rgb', 'hsl', 'lch', 'oklch'];

export async function findColorFunctionsInText(text) {
  const colorMatches = [...text.matchAll(colorRegex)];
  const cssVarMatches = [...text.matchAll(cssVarRegex)];

  return [...colorMatches, ...cssVarMatches].map(createColorFunctionObject);
}

function createColorFunctionObject(match) {
  const start = match.index;
  const end = start + match[0].length;
  let color = match[0];

  const cssVarMatchArray = Array.from(color.matchAll(cssVarRegex));
console.log({cssVarMatchArray});

  if (cssVarMatchArray.length > 0) {
    const cssVarMatch = cssVarMatchArray[0]; // Assuming you want the first match

    console.log('CSS variable match:', cssVarMatch); // Debugging line

    const colorFunction = cssVarMatch[2];
    const colorValues = cssVarMatch[3];

    console.log('Color function:', colorFunction); // Debugging line
    console.log('Color values:', colorValues); // Debugging line

    if (allowedColorFunctions.includes(colorFunction)) {
      color = `${colorFunction}(${colorValues})`;
    }
  }

  return { start, end, color };
}

export function sortStringsInDescendingOrder(strings) {
  return strings.sort((a, b) => b.localeCompare(a));
}