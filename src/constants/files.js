import keyMirror from 'keymirror';

const actions = keyMirror({
  VERIFY: null,
  REFUSE: null,
});

const categories = keyMirror({
  DOCUMENT_VERIFICATION: null,
  ADDRESS_VERIFICATION: null,
  OTHER: null,
});

const categoriesLabels = {
  [categories.DOCUMENT_VERIFICATION]: 'FILES.CATEGORY.DOCUMENT_VERIFICATION',
  [categories.ADDRESS_VERIFICATION]: 'FILES.CATEGORY.ADDRESS_VERIFICATION',
  [categories.OTHER]: 'FILES.CATEGORY.OTHER',
};

const documentsType = keyMirror({
  BANK_STATEMENT: null,
  CREDIT_OR_DEBIT_CARD: null,
  DRIVING_LICENSE: null,
  EMPLOYER_LETTER: null,
  ID_CARD: null,
  INSURANCE_AGREEMENT: null,
  PASSPORT: null,
  RENT_AGREEMENT: null,
  TAX_BILL: null,
  UTILITY_BILL: null,
});

const documentsTypeLabels = {
  [documentsType.BANK_STATEMENT]: 'FILES.DOCUMENTS_TYPE.BANK_STATEMENT',
  [documentsType.CREDIT_OR_DEBIT_CARD]: 'FILES.DOCUMENTS_TYPE.CREDIT_OR_DEBIT_CARD',
  [documentsType.DRIVING_LICENSE]: 'FILES.DOCUMENTS_TYPE.DRIVING_LICENSE',
  [documentsType.EMPLOYER_LETTER]: 'FILES.DOCUMENTS_TYPE.EMPLOYER_LETTER',
  [documentsType.ID_CARD]: 'FILES.DOCUMENTS_TYPE.ID_CARD',
  [documentsType.INSURANCE_AGREEMENT]: 'FILES.DOCUMENTS_TYPE.INSURANCE_AGREEMENT',
  [documentsType.PASSPORT]: 'FILES.DOCUMENTS_TYPE.PASSPORT',
  [documentsType.RENT_AGREEMENT]: 'FILES.DOCUMENTS_TYPE.RENT_AGREEMENT',
  [documentsType.TAX_BILL]: 'FILES.DOCUMENTS_TYPE.TAX_BILL',
  [documentsType.UTILITY_BILL]: 'FILES.DOCUMENTS_TYPE.UTILITY_BILL',
};

const statuses = keyMirror({
  APPROVED: null,
  REJECTED: null,
  PENDING: null,
});

const statusesLabels = {
  [statuses.APPROVED]: 'FILES.STATUSES.APPROVED',
  [statuses.REJECTED]: 'FILES.STATUSES.REJECTED',
  [statuses.PENDING]: 'FILES.STATUSES.PENDING',
};

export {
  actions,
  categories,
  categoriesLabels,
  statuses,
  documentsType,
  statusesLabels,
  documentsTypeLabels,
};
