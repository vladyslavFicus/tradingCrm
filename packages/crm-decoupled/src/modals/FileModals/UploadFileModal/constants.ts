import { Utils } from '@crm/common';

export const attributeLabels = {
  name: 'FILES.UPLOAD_MODAL.FILE.TITLE',
  category: 'FILES.UPLOAD_MODAL.FILE.CATEGORY',
};

export const translatedLabels: Record<string, string> = {
  title: 'FILES.UPLOAD_MODAL.FILE.LABELS.NAME',
  category: 'FILES.UPLOAD_MODAL.FILE.LABELS.CATEGORY',
  documentType: 'FILES.UPLOAD_MODAL.FILE.LABELS.DOCUMENT_TYPE',
};

export const ALLOWED_FILE_MAX_SIZE = 16;
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.oasis.opendocument.text',
  'application/x-vnd.oasis.opendocument.text',
];

type Rule = {
  title: Array<string>,
  category: Array<string>,
  documentType: Array<string>,
};

export const validate = (values: any) => {
  const rules: Record<string, Rule> = {};
  const labels: Record<string, string> = {};

  Object.keys(values).forEach((fieldKey) => {
    const fileUuid = fieldKey.split('.')[0];

    rules[fileUuid] = {
      title: ['required', 'string'],
      category: ['required', 'string'],
      documentType: ['required', 'string'],
    };

    Object.keys(translatedLabels).forEach((key) => {
      labels[`${fileUuid}.${key}`] = translatedLabels[key];
    });
  });

  return Utils.createValidator(rules, Utils.translateLabels(labels), false)(values);
};
