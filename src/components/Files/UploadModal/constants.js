import config from 'config';

export const attributeLabels = {
  name: 'FILES.UPLOAD_MODAL.FILE.TITLE',
  category: 'FILES.UPLOAD_MODAL.FILE.CATEGORY',
};

export const translatedLabels = {
  title: 'FILES.UPLOAD_MODAL.FILE.LABELS.NAME',
  category: 'FILES.UPLOAD_MODAL.FILE.LABELS.CATEGORY',
  documentType: 'FILES.UPLOAD_MODAL.FILE.LABELS.DOCUMENT_TYPE',
};

export const ALLOWED_FILE_MAX_SIZE = config.player.files.maxSize;
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
