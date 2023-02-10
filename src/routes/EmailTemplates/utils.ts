import { createValidator } from 'utils/validator';

export const validator = createValidator({
  name: 'required|min:2',
  subject: 'required|min:2',
  text: 'required|min:12',
});
