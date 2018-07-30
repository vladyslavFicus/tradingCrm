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
    deviceTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    handleSubmit: null,
    submitting: false,
  };

  render() {
    const {
      handleSubmit,
      onSubmit,
      onCloseModal,
      submitting,
      isOpen,
      deviceTypes,
      valid,
    } = this.props;

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
          <Choose>
            <When condition={deviceTypes.length > 1}>
              <div className="text-center font-weight-700">
                {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.MODALS.DEVICE_TYPE.CHOOSE_DEVICE_TYPE_TEXT')}
              </div>
              <div className="row">
                <Field
                  name="deviceType"
                  label={I18n.t(attributeLabels.deviceType)}
                  component={SelectField}
                  className="col-6"
                >
                  <option value="">{I18n.t(attributeLabels.chooseDeviceType)}</option>
                  {deviceTypes.map(key => (
                    <option key={key} value={key}>
                      {renderLabel(key, deviceTypesLabels)}
                    </option>
                  ))}
                </Field>
              </div>
            </When>
            <Otherwise>
              <div className="text-center font-weight-700">
                {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.MODALS.DEVICE_TYPE.CONFIRM_ACTION_TEXT')}
              </div>
            </Otherwise>
          </Choose>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-default-outline mr-auto"
            disabled={submitting}
            type="button"
            onClick={onCloseModal}
          >
            {I18n.t('COMMON.CANCEL')}
          </button>
          <button
            type="submit"
            className="btn btn-danger-outline"
            disabled={!valid || submitting}
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
