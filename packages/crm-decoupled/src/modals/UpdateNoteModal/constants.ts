import { createValidator, translateLabels } from 'utils/validator';

export const MAX_NOTE_BODY_LENGTH = 10000;

export const attributeLabels = {
  pin: 'NOTES.MODAL.PIN',
  subject: 'NOTES.SUBJECT',
  content: 'NOTES.BODY',
};

export const validator = createValidator({
  subject: 'string',
  content: ['required', 'string', `between:3,${MAX_NOTE_BODY_LENGTH}`],
  pinned: ['required', 'boolean'],
}, translateLabels(attributeLabels), false);
