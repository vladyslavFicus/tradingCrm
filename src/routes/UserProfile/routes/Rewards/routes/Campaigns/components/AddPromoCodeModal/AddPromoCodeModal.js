import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { createValidator, translateLabels } from '../../../../../../../../utils/validator';
import { InputField } from '../../../../../../../../components/ReduxForm';
import { attributeLabels } from './constants';
import normalizePromoCode from '../../../../../../../../utils/normalizePromoCode';

class AddPromoCodeModal extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    fullName: PropTypes.string.isRequired,
  };
  static defaultProps = {
    pristine: false,
    submitting: false,
    handleSubmit: null,
  };

  render() {
    const {
      onSubmit,
      handleSubmit,
      onClose,
      pristine,
      submitting,
      invalid,
      fullName,
    } = this.props;

    return (
      <Modal toggle={onClose} isOpen>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={onClose}>
            {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.MODALS.ADD_PROMO_CODE.TITLE')}
          </ModalHeader>
          <ModalBody>
            <div className="add-to-campaign-modal__header">
              {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.MODALS.ADD_PROMO_CODE.ACTION', { fullName })}
            </div>
            <Field
              name="promoCode"
              placeholder=""
              label={I18n.t(attributeLabels.promoCode)}
              type="text"
              position="vertical"
              component={InputField}
              normalize={normalizePromoCode}
            />
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-default-outline"
              disabled={submitting}
              type="reset"
              onClick={onClose}
            >
              {I18n.t('COMMON.CANCEL')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={pristine || submitting || invalid}
            >
              {I18n.t('COMMON.CONFIRM')}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

const FORM_NAME = 'addPromoCodeModal';
export default reduxForm({
  form: FORM_NAME,
  validate: createValidator({
    promoCode: ['required', 'string'],
  }, translateLabels(attributeLabels), false),
})(AddPromoCodeModal);
