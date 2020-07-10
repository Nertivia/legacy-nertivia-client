import pako from "pako";

export function zip(string) {
  const binaryString = pako.deflate(string, { to: "string" });
  return btoa(binaryString);
}

export function unzip(base64) {
  try {
    const binaryString = atob(base64);
    return pako.inflate(binaryString, { to: "string" });
  } catch {
    return null;
  }
}


export function unzipAlt(base64) {
  try {
    const binaryString = Buffer.from(base64, 'base64').toString();
    return pako.inflate(binaryString, { to: "string" });
  } catch {
    return null;
  }
}