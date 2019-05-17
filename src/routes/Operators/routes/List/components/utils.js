import { departments, roles } from 'constants/operators';
import { userTypes } from 'constants/hierarchyTypes';

const roleMapper = department => ({
  [roles.ROLE4]: userTypes[`${department}_HOD`],
  [roles.ROLE3]: userTypes[`${department}_MANAGER`],
  [roles.ROLE2]: userTypes[`${department}_LEAD`],
  [roles.ROLE1]: userTypes[`${department}_AGENT`],
});

export const getUserTypeByDepartment = (department, role) => {
  switch (department) {
    case departments.RETENTION:
    case departments.SALES: {
      return roleMapper(department)[role];
    }
    case departments.AFFILIATE_PARTNER: {
      return departments.AFFILIATE_PARTNER;
    }
    case departments.AFFILIATE_MANAGER: {
      return departments.AFFILIATE_MANAGER;
    }
    default:
      return 'BRAND_ADMIN';
  }
};

