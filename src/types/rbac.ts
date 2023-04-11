export enum ActionKey {
  view = 'view',
  edit = 'edit',
}

export type Action = {
  action: string,
  state: boolean,
};

export type Actions = Partial<Record<ActionKey, Action>>;

type Item = {
  id: string,
  actions: Actions,
  withoutImage?: boolean,
};

type RootItem = {
  permissions: Array<Item>,
  additional?: {
    permissions: Array<string>,
  },
};

export type RbackItem = Item & RootItem;
