import keyMirror from 'keymirror';
import I18n from 'i18n-js';

const attributeLabels = {
  firstName: 'COMMON.FIRST_NAME',
  lastName: 'COMMON.LAST_NAME',
  email: 'COMMON.EMAIL',
  phone: 'COMMON.PHONE',
  department: 'COMMON.DEPARTMENT',
  role: 'COMMON.ROLE',
  userType: 'COMMON.USER_TYPE',
  branch: 'COMMON.BRANCH',
  branchType: 'COMMON.BRANCH_TYPE',
  password: 'COMMON.PASSWORD',
};

const customErrors = {
  'regex.password': I18n.t('COMMON.PASSWORD_INVALID'),
};

const fieldNames = keyMirror({
  department: null,
  role: null,
});

const getBranchOption = branchType => [{ value: branchType, label: `COMMON.${branchType}` }];

export {
  attributeLabels,
  fieldNames,
  getBranchOption,
  customErrors,
};
