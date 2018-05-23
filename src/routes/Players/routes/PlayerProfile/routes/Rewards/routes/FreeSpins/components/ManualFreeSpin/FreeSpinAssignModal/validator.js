import { createValidator, translateLabels } from '../../../../../../../../../../../utils/validator';
import { attributeLabels } from '../constants';

export default values => createValidator({
  uuid: 'required|string',
  freeSpinsAmount: 'integer|min:0|required',
  startDate: 'required|regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
  endDate: 'required|regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
}, translateLabels(attributeLabels), false)(values);
