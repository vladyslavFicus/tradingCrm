import React from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { SelectField } from 'components/ReduxForm';
import { attributeLabels } from './constants';

const AccountStatusModal = ({
  action, reasons, title, onHide, onSubmit, handleSubmit, invalid,
}) => (
  <Modal isOpen toggle={onHide}>
    <form onSubmit={handleSubmit(onSubmit)}>
      {
        !!title
        && (
          <ModalHeader toggle={onHide}>
            {title}
          </ModalHeader>
        )
      }
      <ModalBody>
        <Field
          name="reason"
          label={I18n.t(attributeLabels.reason)}
          component={SelectField}
          position="vertical"
        >
          <option>{I18n.t('COMMON.SELECT_OPTION.REASON')}</option>
          {Object.keys(reasons).map(key => (
            <option key={key} value={key}>
              {I18n.t(renderLabel(key, reasons))}
            </option>
          ))}
        </Field>
      </ModalBody>

      <ModalFooter>
        <button type="button" className="btn btn-default-outline mr-auto" onClick={onHide}>
          {I18n.t('COMMON.BUTTONS.CANCEL')}
        </button>
        <button
          className="btn btn-danger"
          type="submit"
          disabled={invalid}
        >
          {action}
        </button>
      </ModalFooter>
    </form>
  </Modal>
);

AccountStatusModal.propTypes = {
  action: PropTypes.string,
  reasons: PropTypes.object.isRequired,
  title: PropTypes.string,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  invalid: PropTypes.bool.isRequired,
};

AccountStatusModal.defaultProps = {
  action: null,
  title: '',
  handleSubmit: null,
};

export default reduxForm({
  form: 'accountStatusModal',
  validate: (values, props) => createValidator({
    reason: `required|string|in:${Object.keys(props.reasons).join()}`,
  }, translateLabels(attributeLabels), false)(values),
})(AccountStatusModal);
