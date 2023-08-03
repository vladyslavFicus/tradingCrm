/* eslint-disable jsx-control-statements/jsx-jcs-no-undef */
const bufferToHex = (buffer: any) => {
  const view = new DataView(buffer);

  let hexCodes = '';
  for (let index = 0; index < view.byteLength; index += 4) {
    hexCodes += view.getUint32(index).toString(16).padStart(8, '0');
  }

  return hexCodes;
};

const create = (algorithm: string) => async (buffer: any) => {
  if (typeof buffer === 'string') {
    // eslint-disable-next-line no-param-reassign
    buffer = new globalThis.TextEncoder().encode(buffer);
  }

  const hash = await globalThis.crypto.subtle.digest(algorithm, buffer);
  return bufferToHex(hash);
};

export const sha256 = create('SHA-256');
