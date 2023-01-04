export type Permission = {
  permissions: Array<string>,
  allows: (action: string) => boolean,
  denies: (action: string) => boolean,
};

export type PermissionContext = {
  permission: Permission,
};
