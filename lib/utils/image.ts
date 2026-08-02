const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

const encodeBase64 = (str: string): string => {
  let output = "";
  let i = 0;

  while (i < str.length) {
    const e1 = str.charCodeAt(i++);
    const e2 = str.charCodeAt(i++);
    const e3 = str.charCodeAt(i++);

    output += triplet(e1, e2, e3);
  }

  return output;
};

const svgToMiniDataURI = (width = 700, height = 475): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="#f3f4f6"/>
    <rect id="r" width="${width}" height="${height}" fill="#e5e7eb" opacity="0.6"/>
  </svg>`;

  return `data:image/svg+xml;base64,${encodeBase64(svg)}`;
};

export const getBlurDataURL = (w = 700, h = 475): string => {
  return svgToMiniDataURI(w, h);
};
