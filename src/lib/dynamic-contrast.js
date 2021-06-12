// getColorContrast
//     Return suggested contrast grey scale color for the color (hex/rgba) given.
//     Takes advantage of YIQ: https://en.wikipedia.org/wiki/YIQ
//     Inspired by: http://24ways.org/2010/calculating-color-contrast/
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
    r, g, b, yiq;
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
  yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  if (yiq >= 128) {
    yiq -= 128;
  } else {
    yiq += 128;
  }
  color = yiq << 16 | yiq << 8 | yiq;
  color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
  return color;
}
