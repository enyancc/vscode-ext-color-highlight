// getColorContrast
//     Return suggested contrast grey scale color for the color (hex/rgba) given.
//     Uses the definitions of relative luminance and contrast ratio from
//     WCAG 2.0: https://www.w3.org/TR/WCAG20
//
// @param color string A valid hex or rgb value, examples:
//                         #000, #000000, 000, 000000
//                         rgb(255, 255, 255), rgba(255, 255, 255),
//                         rgba(255, 255, 255, 1)
//                         blue, green, red
// @return      string of the form #RRGGBB
import webColors from 'color-name';

export function getColorContrast(color) {
  const rgbExp = /^rgba?[\s+]?\(\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*(?:,\s*([\d.]+)\s*)?\)/im,
    hexExp = /^(?:#)|([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/igm;
  let rgb = color.match(rgbExp),
    hex = color.match(hexExp),
    r, g, b;
  if (rgb) {
    r = parseInt(rgb[1], 10);
    g = parseInt(rgb[2], 10);
    b = parseInt(rgb[3], 10);
  } else if (hex) {
    if (hex.length > 1) {
      hex = hex[1];
    } else {
      hex = hex[0];
    }
    if (hex.length == 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  } else {
    rgb = webColors[color.toLowerCase()];
    if (rgb) {
      r = rgb[0];
      g = rgb[1];
      b = rgb[2];
    } else {
      return '#000000';
    }
  }
  // The color with the maximum contrast ratio to our input color is guaranteed
  // to either be white or black, so we just check both and pick whichever has
  // a higher contrast ratio.

  let luminance = relativeLuminance(r, g, b);

  // This is equivalent to `relativeLuminance(255, 255, 255)` (by definition).
  let luminanceWhite = 1.0;
  // This is equivalent to `relativeLuminance(0, 0, 0)` (by definition).
  let luminanceBlack = 0.0;

  let contrastWhite = contrastRatio(luminance, luminanceWhite);
  let contrastBlack = contrastRatio(luminance, luminanceBlack);
  if (contrastWhite > contrastBlack) {
    return '#FFFFFF';
  } else {
    return '#000000';
  }
}

// Note: the rest of this module contains unexported helper functions.

/**
 * Compute the contrast ratio between two relative luminances, using the
 * algorithm from WCAG 2.0: <https://www.w3.org/TR/WCAG20/#contrast-ratiodef>
 *
 * Note that the order of the arguments does not matter. In other words, if `a`
 * and `b` are valid inputs, then `contrastRatio(a, b) === contrastRatio(b, a)`.
 *
 * @param l1 number  The relative luminance of the first color -- a number
 *                   between 0.0 and 1.0 (inclusive), which should be produced
 *                   by the `relativeLuminance` function.
 * @param l2 number  The relative luminance of the second color -- a number
 *                   between 0.0 and 1.0 (inclusive), which is expected to have
 *                   been produced by the `relativeLuminance` function.
 *
 * @returns  number  The contrast ratio between the input colors. Assuming the
 *                   inputs were in the correct range, this will be a number
 *                   between 1.0 and 21.0 (inclusive).
 */
function contrastRatio(l1, l2) {
  // Note: the denominator of the contrast ratio must be the darker (e.g. lower
  // relative luminance) color.
  if (l2 < l1) {
    return (0.05 + l1) / (0.05 + l2);
  } else {
    return (0.05 + l2) / (0.05 + l1);
  }
}

/**
 * Compute the relative luminance of a color, using the algorithm from WCAG 2.0
 * <https://www.w3.org/TR/WCAG20/#relativeluminancedef>.
 *
 * All three color components used as input should be integers between 0 and 255
 * inclusive, and are assumed to be in the sRGB color space -- typical for
 * source code constants, especially ones using CSS syntax, as sRGB is the
 * default color space on the web.
 *
 * (Note: it's overwhelmingly likely that even if the true color space of the
 * color is *not* sRGB, that it still has an sRGB-style gamma curve, if not a
 * fully sRGB-compatible one, in which case the result of this function will
 * still be reasonable)
 *
 * @param r8 number  The red component, as an 8-bit integer
 * @param g8 number  The green component, as an 8-bit integer
 * @param b8 number  The blue component, as an 8-bit integer
 *
 * @returns  number  The relative luminance of the color, a number between 0.0
 *                   and 1.0 (inclusive).
 */
function relativeLuminance(r8, g8, b8) {
  const bigR = srgb8ToLinear(r8);
  const bigG = srgb8ToLinear(g8);
  const bigB = srgb8ToLinear(b8);
  return 0.2126 * bigR + 0.7152 * bigG + 0.0722 * bigB;
}

/**
 * Convert an 8-bit color component from sRGB space (the default web color
 * space) into the linear RGB color space.
 *
 * This is a helper function for `relativeLuminance`, and at the moment isn't
 * needed except as part of calling that function.
 *
 * @param c8 number  An 8-bit integer color channel in the sRGB color space. In
 *                   other words, a number between 0 and 255 (inclusive).
 *                   Anything outside this range will be clamped and truncated.
 *
 * @returns  number  The value of the channel in a linear RGB color space -- a
 *                   number between 0.0 and 1.0, inclusive.
 */
const srgb8ToLinear = (function() {
  // There are only 256 possible different input values (0 <= input <= 255),
  // so we just use a lookup table, which to avoid repeating the (somewhat
  // costly) computation 3 times for each input.
  const srgbLookupTable = new Float64Array(256);
  for (let i = 0; i < 256; ++i) {
    const c = i / 255.0;
    srgbLookupTable[i] = (c <= 0.04045)
      ? c / 12.92
      : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  return function srgb8ToLinear(c8) {
    // Input should be an integer between 0 and 255 already, but clamp if
    // for some reason it is not.
    const index = Math.min(Math.max(c8, 0), 255) & 0xff;
    return srgbLookupTable[index];
  };
}());
