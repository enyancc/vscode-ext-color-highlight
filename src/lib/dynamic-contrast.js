// getColorContrast
//     Return suggested contrast color (dark or light) for the color (hex/rgba) given.
//     Takes advantage of YIQ: https://en.wikipedia.org/wiki/YIQ
//         dark = background is light, use dark colors for text, images, etc..
//         light = background is dark, use light colors for text, images, etc..
//     Inspired by: http://24ways.org/2010/calculating-color-contrast/
//
// @param color string A valid hex or rgb value, examples:
//                         #000, #000000, 000, 000000
//                         rgb(255, 255, 255), rgba(255, 255, 255),
//                         rgba(255, 255, 255, 1)
// @return      string dark|light
export function getColorContrast(color) {
    if(color === undefined || color === "") {
        return null;
    }
    var rgbExp = /^rgba?[\s+]?\(\s*(([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]))\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,?(?:\s*([\d.]+))?\s*\)?\s*/im,
        hexExp = /^(?:#)|([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/igm,
        rgb    = color.match(rgbExp),
        hex    = color.match(hexExp),
        r,
        g,
        b,
        yiq;
    if (rgb) {
        r = parseInt(rgb[1], 10);
        g = parseInt(rgb[2], 10);
        b = parseInt(rgb[3], 10);
    } else if (hex)  {
        if (hex.length > 1) {
            hex = hex[1];
        } else {
            hex = hex[0];
        }
        if (hex.length == 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        r = parseInt(hex.substr(0,2),16);
        g = parseInt(hex.substr(2,2),16);
        b = parseInt(hex.substr(4,2),16);
    } else {
        return null;
    }
    yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'dark' : 'light';
}
