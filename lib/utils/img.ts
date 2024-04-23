export const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer) =>
  btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
