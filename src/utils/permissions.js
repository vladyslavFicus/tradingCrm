import keyMirror from 'keymirror';

let pushCondition = (ctx) => (condition, permissions) => {
  ctx.__permissions = ctx.__permissions.length
    ? [condition, [ctx.__permissions, permissions],]
    : Array.isArray(permissions)
      ? [condition, permissions]
      : [condition, [permissions]];

  return ctx;
};

const CONDITIONS = keyMirror({
  OR: null,
  AND: null,
});

class Permissions {
  __permissions = [];

  constructor(permissions, condition = CONDITIONS.AND) {
    this.pushCondition = pushCondition(this);

    if (permissions && (!Array.isArray(permissions) || permissions.length > 0)) {
      this.pushCondition(condition, permissions);
    }
  }

  and = (permissions) => {
    return this.pushCondition(CONDITIONS.AND, permissions);
  };

  or = (permissions) => {
    return this.pushCondition(CONDITIONS.OR, permissions);
  };

  /**
   * @param currentPermissions
   */
  check = (currentPermissions = []) => {
    if (!Array.isArray(currentPermissions)) {
      throw new Error('Current permission should be an array.');
    }

    if (!this.__permissions.length) {
      return true;
    }

    if (!currentPermissions.length) {
      return false;
    }

    const [condition, allowedPermissions] = this.__permissions;

    return this.checkPermissions(condition, allowedPermissions, currentPermissions);
  };

  checkPermissions = (condition, allowedPermissions, currentPermissions) => {
    if (condition === CONDITIONS.OR) {
      return allowedPermissions.some(item => this.checkPermissionItem(currentPermissions, item));
    } else if (condition === CONDITIONS.AND) {
      return allowedPermissions.every(item => this.checkPermissionItem(currentPermissions, item));
    }
  };

  checkPermissionItem = (currentPermissions, item) => {
    const typeOfItem = typeof item;

    if (typeOfItem === 'string') {
      return currentPermissions.indexOf(item) > -1;
    } else if (typeOfItem === 'object' && Array.isArray(item) && item.length) {
      const [condition, allowedPermissions] = item;
      if (condition !== CONDITIONS.AND && condition !== CONDITIONS.OR) {
        return item.every(i => this.checkPermissionItem(currentPermissions, i));
      }

      return this.checkPermissions(condition, allowedPermissions, currentPermissions);
    }

    return false;
  };

  getCompiled = () => this.__permissions;
}

export { CONDITIONS };
export default Permissions;
