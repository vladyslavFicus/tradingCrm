import keyMirror from 'keymirror';
import { passwordCustomError } from 'constants/operators';

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
  'regex.password': passwordCustomError,
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
