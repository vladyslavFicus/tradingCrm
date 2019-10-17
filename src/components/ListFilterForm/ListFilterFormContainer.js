import { getFormValues, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { createValidator } from '../../utils/validator';
import { getValidationRules } from '../ReduxForm/ReduxFieldsConstructor';
import ListFilters from './ListFilters';

const FORM_NAME = `listFiltersFrom-${Math.random().toString(36).slice(8)}`;

const ListFilterForm = reduxForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: (values, { fields }) => createValidator(getValidationRules(fields), false)(values),
})(ListFilters);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
  enableReinitialize: true,
}))(ListFilterForm);
