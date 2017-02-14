import keyMirror from 'keymirror';

let pushCondition = (ctx) => (condition, permissions) => {
  ctx.__permissions = ctx.__permissions.length
    ? [condition, [ctx.__permissions, permissions],]
    : Array.isArray(permissions)
      ? permissions
      : [permissions];

  return this;
};

const CONDITIONS = keyMirror({
  OR: null,
  AND: null,
});

class Permissions {
  __permissions = [];

  constructor(permissions, condition = CONDITIONS.AND) {
    this.pushCondition = pushCondition(this);

    return this.pushCondition(condition, permissions);
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
  check = (currentPermissions) => {
    // @todo
  };
}

export { CONDITIONS };
export default Permissions;
