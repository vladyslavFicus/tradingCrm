export const attributeLabels = {
  name: 'DOCUMENTS.MODALS.ADD_DOCUMENT.TITLE',
  DESCRIPTION: 'DOCUMENTS.MODALS.ADD_DOCUMENT.DESCRIPTION',
};

export const TRANSLATED_LABELS = {
  title: 'DOCUMENTS.MODALS.ADD_DOCUMENT.LABELS.TITLE',
  category: 'DOCUMENTS.MODALS.ADD_DOCUMENT.LABELS.DESCRIPTION',
  documentType: 'DOCUMENTS.MODALS.ADD_DOCUMENT.LABELS.FILE',
};

export const FILE_CONFIG = {
  maxSize: 100, // Mb
  types: '.doc, .docx, .gif, .pdf, .png, .jpg, .jpeg, .pps, .rtf, .tiff, .tif, .txt, .xls, .xlsx',
};

export const RULES = {
  title: ['required', 'string', 'max:500'],
  description: ['string', 'max:1000'],
  file: ['required'],
};
