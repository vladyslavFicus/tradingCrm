import { downloadBlob } from '@newage/backoffice_utils';
import { getApiRoot } from '../config';

export default async ({ urlPath, fileName, token, contentType = '' }) => {
  const response = await fetch(`${getApiRoot()}/${urlPath}`, {
    method: 'GET',
    headers: {
      'Content-Type': contentType,
      Authorization: `Bearer ${token}`,
    },
  });

  const { ok, statusText } = response;

  if (ok) {
    const blobData = await response.blob();

    downloadBlob(fileName, blobData);
  }

  return {
    success: ok,
    error: !ok && statusText ? statusText : '',
  };
};
