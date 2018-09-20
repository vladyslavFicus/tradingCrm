import { groupBy } from 'lodash';
import hierarchyTypes from '../constants/hierarchyTypes';

const mapArray = arr => arr.map(item => item.uuid);

const getHierarchyTypes = (array, type) => {
  switch (type) {
    case hierarchyTypes.CUSTOMER:
      return { type: 'clients', users: mapArray(array) };
    case hierarchyTypes.LEAD_CUSTOMER:
      return { type: 'leads', users: mapArray(array) };
    default:
      return { type, users: mapArray(array) };
  }
};

export default (users) => {
  const groupedUsers = groupBy(users, 'userType');
  const hierarchy = [];

  Object.entries(groupedUsers).forEach(([type, usersArray]) => {
    hierarchy.push(getHierarchyTypes(usersArray, type));
  });

  return hierarchy.reduce((acc, curr) => ({
    ...acc,
    [curr.type]: curr.users,
  }), {});
};
