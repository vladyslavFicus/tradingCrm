import keyMirror from 'keymirror';
import { filterLabels } from '../../../../../constants/user';
import createDynamicForm from '../../../../../components/DynamicFilters';
import { createValidator } from '../../../../../utils/validator';

const ANY = { value: null, name: 'COMMON.ANY' };

const acquisitionStatuses = [{
  value: 'SALES',
  label: 'COMMON.SALES',
}, {
  value: 'RETENTION',
  label: 'COMMON.RETENTION',
}];

const assignStatuses = [{
  value: 'ASSIGN',
  label: 'COMMON.ASSIGN',
}, {
  value: 'UN_ASSIGN',
  label: 'COMMON.UN_ASSIGN',
}];

const kycStatuses = [{
  value: 'NO_KYC',
  label: 'KYC_REQUESTS.STATUS.NO_KYC',
}, {
  value: 'PENDING',
  label: 'KYC_REQUESTS.STATUS.PENDING',
}, {
  value: 'VERIFIED',
  label: 'KYC_REQUESTS.STATUS.VERIFIED',
}, {
  value: 'REFUSED',
  label: 'KYC_REQUESTS.STATUS.REFUSED',
}, {
  value: 'DOCUMENTS_SENT',
  label: 'KYC_REQUESTS.STATUS.DOCUMENTS_SENT',
}];

const firstDepositStatuses = [{
  value: 'YES',
  label: 'COMMON.YES',
}, {
  value: 'NO',
  label: 'COMMON.NO',
}];


const fieldNames = keyMirror({
  desks: null,
  teams: null,
});

const FORM_NAME = 'userListGridFilter';

const DynamicFilters = createDynamicForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: (_, props) => createValidator({
    keyword: 'string',
    country: `in:,${Object.keys(props.countries).join()}`,
    status: 'string',
    acquisitionStatus: 'string',
    teams: 'string',
    desks: 'string',
    registrationDateFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    registrationDateTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    tradingBalanceFrom: 'integer',
    tradingBalanceFromTo: 'integer',
  }, filterLabels, false),
});

export {
  acquisitionStatuses,
  DynamicFilters,
  fieldNames,
  FORM_NAME,
  ANY,
  assignStatuses,
  kycStatuses,
  firstDepositStatuses,
};
