import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { SelectField } from '../../../../../../../../../../components/ReduxForm';
import {
  attributeLabels,
  deviceTypesLabels,
} from '../../../../../../../../../Campaigns/components/Rewards/constants';
import renderLabel from '../../../../../../../../../../utils/renderLabel';

class OptInModal extends Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    deviceTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    handleSubmit: null,
    pristine: false,
    submitting: false,
  };

  componentDidMount() {
    const { deviceTypes, change } = this.props;

    if (deviceTypes.length === 1) {
      change('deviceType', deviceTypes[0]);
    }
  }

  render() {
    const {
      handleSubmit,
      onSubmit,
      onCloseModal,
      pristine,
      submitting,
      isOpen,
      deviceTypes,
    } = this.props;

    const actionText = deviceTypes.length > 1
      ? I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.MODALS.DEVICE_TYPE.CHOOSE_DEVICE_TYPE_TEXT')
      : I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.MODALS.DEVICE_TYPE.CONFIRM_ACTION_TEXT');

    return (
      <Modal isOpen={isOpen} className="modal-danger" toggle={onCloseModal}>
        <ModalHeader toggle={onCloseModal}>
          {I18n.t('COMMON.CONFIRM_ACTION')}
        </ModalHeader>
        <ModalBody
          id="opt-in-modal"
          tag="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-center font-weight-700">
            <div>{actionText}</div>
          </div>
          <If condition={deviceTypes.length > 1}>
            <div className="row">
              <div className="col-6">
                <Field
                  name="deviceType"
                  label={I18n.t(attributeLabels.deviceType)}
                  type="select"
                  component={SelectField}
                  disabled={deviceTypes.length === 1}
                >
                  <option value="">{I18n.t(attributeLabels.chooseDeviceType)}</option>
                  {deviceTypes.map(key => (
                    <option key={key} value={key}>
                      {renderLabel(key, deviceTypesLabels)}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
          </If>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-default-outline mr-auto"
            disabled={submitting}
            type="reset"
            onClick={onCloseModal}
          >
            {I18n.t('COMMON.CANCEL')}
          </button>
          <button
            type="submit"
            className="btn btn-danger-outline"
            disabled={pristine || submitting}
            form="opt-in-modal"
          >
            {I18n.t('COMMON.BUTTONS.CONFIRM')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default OptInModal;
