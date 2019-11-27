import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import I18n from 'i18n-js';
import { Button } from 'reactstrap';
import { getPaymentReason } from 'config/index';
import attributeLabels from '../constants';
import { createValidator, translateLabels } from '../../../utils/validator';
import { NasSelectField } from '../../ReduxForm/index';

const formName = 'rejectForm';

const RejectForm = (props) => {
  const {
    handleSubmit,
    onSubmit,
  } = props;

  return (
    <form className="d-flex flex-column justify-content-between flex-1">
      <Field
        label={I18n.t('PAYMENT_DETAILS_MODAL.CHOOSE_REJECTION_REASONS_LABEL')}
        customClassName="form-group"
        component={NasSelectField}
        name="rejectionReason"
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
      >
        {getPaymentReason().refuse.map(item => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Field>
      <div>
        <Button
          onClick={handleSubmit(onSubmit('reject'))}
          className="btn btn-default payment-detail-modal__button"
          type="submit"
        >
          {I18n.t('COMMON.REJECT')}
        </Button>
      </div>
    </form>
  );
};

RejectForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: formName,
  validate: values => createValidator({
    rejectionReason: ['required'],
  }, translateLabels(attributeLabels), false)(values),
})(RejectForm);
