import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { createValidator } from '../../../../../../utils/validator';
import { SelectField } from '../../../../../../components/ReduxForm';
import { reasons as operatorChangeStatusReasons } from '../../../../../../constants/operators';

const attributeLabels = {
  reason: 'Reason',
};
const validator = createValidator({
  reason: `required|string|in:${operatorChangeStatusReasons.join()}`,
}, attributeLabels, false);

const AccountStatusModal = ({ action, reasons, title, onHide, onSubmit, handleSubmit }) => (
  <Modal isOpen toggle={onHide}>
    <form onSubmit={handleSubmit(onSubmit)}>
      {
        !!title &&
        <ModalHeader toggle={onHide}>
          {title}
        </ModalHeader>
      }
      <ModalBody>
        {
          <Field
            name="reason"
            label={attributeLabels.reason}
            component={SelectField}
            position="vertical"
          >
            <option>-- Select reason --</option>
            {reasons.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Field>
        }
      </ModalBody>

      <ModalFooter>
        <button className="btn btn-default-outline mr-auto" onClick={onHide}>
          {I18n.t('COMMON.BUTTONS.CANCEL')}
        </button>
        <button className="btn btn-danger" type="submit">
          {action}
        </button>
      </ModalFooter>
    </form>
  </Modal>
);

AccountStatusModal.propTypes = {
  action: PropTypes.string,
  reasons: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
};

AccountStatusModal.defaultProps = {
  action: null,
  title: '',
  handleSubmit: null,
};

export default reduxForm({
  form: 'accountStatusModal',
  validate: validator,
})(AccountStatusModal);
