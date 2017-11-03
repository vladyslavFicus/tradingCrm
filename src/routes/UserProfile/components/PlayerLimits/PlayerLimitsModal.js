import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import PropTypes from '../../../../constants/propTypes';
import { createValidator } from '../../../../utils/validator';
import { types, actions } from '../../../../constants/wallet';
import { SelectField } from '../../../../components/ReduxForm';
import Uuid from '../../../../components/Uuid';

const attributeLabels = {
  reason: 'Reason',
};
const validator = createValidator({ reasons: 'required|string' }, attributeLabels, false);

class PlayerLimitsModal extends Component {
  static propTypes = {
    profile: PropTypes.userProfile.isRequired,
    action: PropTypes.oneOf(Object.keys(actions)).isRequired,
    type: PropTypes.oneOf(Object.keys(types)).isRequired,
    reasons: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string.isRequired,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    className: PropTypes.string,
  };
  static defaultProps = {
    handleSubmit: null,
    className: 'modal-danger',
  };

  renderReasonsSelect = reasons => (
    <Field
      name="reason"
      label=""
      component={SelectField}
      position="vertical"
    >
      <option value="">Choose a reason</option>
      {reasons.map(item => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </Field>
  );

  render() {
    const {
      action,
      reasons,
      title,
      onHide,
      onSubmit,
      handleSubmit,
      profile,
      type,
      className,
    } = this.props;

    return (
      <Modal isOpen toggle={onHide} className={className}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {
            !!title &&
            <ModalHeader toggle={onHide}>
              {title}
            </ModalHeader>
          }
          <ModalBody>
            <div className="text-center margin-bottom-20">
              <strong>
                You are about to {action.toLowerCase()} {type === types.DEPOSIT ? 'deposits' : 'withdrawals'}
                {' '}
                for {profile.fullName}
              </strong>
              {' - '}
              <Uuid
                uuid={profile.playerUUID}
                uuidPrefix={profile.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null}
              /> <strong>account</strong>
            </div>

            {reasons && this.renderReasonsSelect(reasons)}
          </ModalBody>

          <ModalFooter>
            <button
              className="btn btn-default-outline mr-auto"
              onClick={onHide}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              type="submit"
            >
              {action} {type}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default reduxForm({
  form: 'playerLimitsModal',
  validate: validator,
})(PlayerLimitsModal);
