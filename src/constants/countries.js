import keyMirror from 'keymirror';

const accessTypes = keyMirror({
  ALLOWED: null,
  FORBIDDEN: null,
});

const accessTypeLabels = {
  [accessTypes.ALLOWED]: 'Allowed',
  [accessTypes.FORBIDDEN]: 'Forbidden',
};

const accessTypesActions = {
  [accessTypes.ALLOWED]: [
    {
      action: accessTypes.FORBIDDEN,
      label: 'Forbidden',
    },
  ],
  [accessTypes.FORBIDDEN]: [
    {
      action: accessTypes.ALLOWED,
      label: 'Allowed',
    },
  ],
};

const accessTypesColor = {
  [accessTypes.ALLOWED]: 'color-success',
  [accessTypes.FORBIDDEN]: 'color-danger',
};

export {
  accessTypes,
  accessTypeLabels,
  accessTypesActions,
  accessTypesColor,
};
