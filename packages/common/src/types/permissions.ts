export type Permission = {
  permissions: Array<string>,
  allows: (action: string) => boolean,
  denies: (action: string) => boolean,
  allowsAll: (actions: Array<string>) => boolean,
  allowsAny: (actions: Array<string>) => boolean,
};

export type PermissionContext = {
  permission: Permission,
};
