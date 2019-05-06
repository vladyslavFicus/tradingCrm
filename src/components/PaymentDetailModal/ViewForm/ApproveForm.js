import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { Button } from 'reactstrap';
import { createValidator, translateLabels } from 'utils/validator';
import {
  manualPaymentMethodsLabels,
  manualPaymentMethods,
} from 'constants/payment';
import attributeLabels from '../constants';
import { NasSelectField } from '../../ReduxForm/index';

const formName = 'approveForm';

const ApproveForm = (props) => {
  const {
    handleSubmit,
    onSubmit,
  } = props;

  return (
    <form className="flex-1 margin-left-15 margin-right-15">
      <Field
        label={I18n.t('PAYMENT_DETAILS_MODAL.CHOOSE_PAYMENT_METHOD_LABEL')}
        customClassName="form-group"
        name="paymentMethod"
        component={NasSelectField}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
      >
        {Object.values(manualPaymentMethods).map(item => (
          <option key={item} value={item}>
            {I18n.t(manualPaymentMethodsLabels[item])}
          </option>
        ))}
      </Field>
      <Button
        onClick={handleSubmit(onSubmit('approve'))}
        className="btn btn-primary payment-detail-modal__button"
        type="submit"
      >
        {I18n.t('COMMON.APPROVE')}
      </Button>
    </form>
  );
};

ApproveForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: formName,
  validate: values => createValidator({
    paymentMethod: ['required'],
  }, translateLabels(attributeLabels), false)(values),
})(ApproveForm);
