import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import PropTypes from '../../../../constants/propTypes';
import { createValidator } from '../../../../utils/validator';
import { types, actions } from '../../../../constants/wallet';
import { SelectField } from '../../../../components/ReduxForm/UserProfile';
import './WalletLimitsModal.scss';
import Uuid from '../../../../components/Uuid';

const attributeLabels = {
  reason: 'Reason',
};
const validator = createValidator({ reasons: 'required|string' }, attributeLabels, false);

class WalletLimitsModal extends Component {
  static propTypes = {
    profile: PropTypes.userProfile.isRequired,
    action: PropTypes.oneOf(Object.keys(actions)),
    type: PropTypes.oneOf(Object.keys(types)),
    isOpen: PropTypes.bool,
    show: PropTypes.bool,
    reasons: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
  };

  renderReasonsSelect = reasons => (
    <div className="form-group">
      <Field
        name="reason"
        label={null}
        component={SelectField}
        className={'form-control'}
      >
        <option value="">Choose a reason</option>
        {reasons.map(item => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Field>
    </div>
  );

  render() {
    const {
      action,
      show,
      reasons,
      title,
      onHide,
      onSubmit,
      handleSubmit,
      profile,
      type,
      ...rest
    } = this.props;

    return (
      <Modal {...rest} isOpen={show} toggle={onHide} className="wallet-limits-modal">
        <form onSubmit={handleSubmit(onSubmit)}>
          {
            !!title &&
            <ModalHeader toggle={onHide}>
              {title}
            </ModalHeader>
          }
          <ModalBody>
            <div className="text-center margin-bottom-50">
              <strong>
                You are about to {action.toLowerCase()} {type === types.DEPOSIT ? 'deposits' : 'withdrawals'}
                {' '}
                for {profile.fullName}
              </strong>
              {' - '}
              <Uuid
                uuid={profile.uuid}
                uuidPrefix={profile.uuid.indexOf('PLAYER') === -1 ? 'PL' : null}
              /> <strong>account</strong>
            </div>

            {reasons && this.renderReasonsSelect(reasons)}
          </ModalBody>

          <ModalFooter>
            <div className="row">
              <div className="col-md-6">
                <button className="btn btn-default-outline text-uppercase" onClick={onHide}>
                  Cancel
                </button>
              </div>
              <div className="col-md-6 text-right">
                <button className="btn btn-danger text-uppercase" type="submit">
                  {action} {type}
                </button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default reduxForm({
  form: 'walletLimitsModal',
  validate: validator,
})(WalletLimitsModal);
