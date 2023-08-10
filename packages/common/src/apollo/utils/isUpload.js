const isFile = value => (
  (typeof window.File !== 'undefined' && value instanceof window.File)
  || (typeof window.Blob !== 'undefined' && value instanceof window.Blob)
);

export const isUpload = ({ variables }) => Object.values(variables).some(isFile);
