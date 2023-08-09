import { Utils } from '@crm/common';

export const validator = Utils.createValidator({
  name: 'required|min:2',
  subject: 'required|min:2',
  text: 'required|min:12',
});
