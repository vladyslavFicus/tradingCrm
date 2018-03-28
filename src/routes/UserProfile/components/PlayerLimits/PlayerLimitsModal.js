import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../constants/propTypes';
import { createValidator, translateLabels } from '../../../../utils/validator';
import { types, actions } from '../../../../constants/wallet';
import { SelectField } from '../../../../components/ReduxForm';
import Uuid from '../../../../components/Uuid';
import renderLabel from '../../../../utils/renderLabel';
import { attributeLabels } from './constants';

class PlayerLimitsModal extends Component {
  static propTypes = {
    profile: PropTypes.userProfile.isRequired,
    action: PropTypes.oneOf(Object.keys(actions)).isRequired,
    type: PropTypes.oneOf(Object.keys(types)).isRequired,
    reasons: PropTypes.object.isRequired,
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
      label={I18n.t('COMMON.REASON')}
      component={SelectField}
      position="vertical"
    >
      <option value="">{I18n.t('COMMON.SELECT_OPTION.REASON')}</option>
      {Object.keys(reasons).map(key => (
        <option key={key} value={key}>
          {renderLabel(key, reasons)}
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
              {I18n.t('COMMON.CANCEL')}
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
  validate: (values, props) => createValidator({
    reason: `required|string|in:${Object.keys(props.reasons).join()}`,
  }, translateLabels(attributeLabels), false)(values),
})(PlayerLimitsModal);
