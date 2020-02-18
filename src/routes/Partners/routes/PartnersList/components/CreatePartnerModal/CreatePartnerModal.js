import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field } from 'redux-form';
import I18n from 'i18n-js';
import { InputField, NasSelectField } from 'components/ReduxForm';
import Regulated from 'components/Regulated';
import CheckBox from 'components/ReduxForm/CheckBox';
import { generate } from 'utils/password';
import { affiliateTypeLabels, affiliateTypes } from '../../../../constants';
import './CreatePartnerModal.scss';

class CreatePartnerModal extends Component {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    change: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired,
    formValues: PropTypes.objectOf(PropTypes.oneOfType(['string', 'boolean'])),
  };

  static defaultProps = {
    pristine: false,
    submitting: false,
    valid: false,
    change: null,
    formValues: {},
  };

  handleGeneratePassword = () => {
    this.props.change('password', generate());
  };

  handleGenerateExternalId = () => {
    this.props.change('externalAffiliateId', Math.random().toString(36).substr(2));
  };

  render() {
    const {
      handleSubmit,
      onCloseModal,
      formValues,
      submitting,
      onSubmit,
      pristine,
      isOpen,
      valid,
    } = this.props;

    return (
      <Modal className="create-operator-modal" toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>{I18n.t('PARTNERS.NEW_PARTNER')}</ModalHeader>
        <ModalBody id="create-operator-modal-form" tag="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <Field
              name="firstName"
              className="col-md-6"
              component={InputField}
              label={I18n.t('COMMON.FIRST_NAME')}
              type="text"
              showErrorMessage
            />
            <Field
              name="lastName"
              className="col-md-6"
              component={InputField}
              label={I18n.t('COMMON.LAST_NAME')}
              type="text"
              showErrorMessage
            />
            <Field
              name="email"
              className="col-md-6"
              component={InputField}
              label={I18n.t('COMMON.EMAIL')}
              type="text"
              showErrorMessage
            />
            <Field
              name="password"
              className="col-md-6"
              component={InputField}
              label={I18n.t('COMMON.PASSWORD')}
              inputAddon={<span className="icon-generate-password" />}
              inputAddonPosition="right"
              onIconClick={this.handleGeneratePassword}
              type="text"
              showErrorMessage
            />
            <Field
              name="phone"
              className="col-md-6"
              component={InputField}
              label={I18n.t('COMMON.PHONE')}
              type="text"
              showErrorMessage
            />
            <Regulated>
              <Field
                name="affiliateType"
                label={I18n.t('COMMON.PARTNER_TYPE')}
                className="col-md-6"
                placeholder={I18n.t('COMMON.SELECT_OPTION.SELECT_PARTNER_TYPE')}
                component={NasSelectField}
                searchable={false}
                withAnyOption={false}
                showErrorMessage
              >
                {Object.keys(affiliateTypeLabels).map(value => (
                  <option key={value} value={value}>{I18n.t(affiliateTypeLabels[value])}</option>
                ))}
              </Field>
            </Regulated>
            <If
              condition={
                formValues.affiliateType
                && formValues.affiliateType !== affiliateTypes.NULLPOINT
              }
            >
              <Field
                name="externalAffiliateId"
                className="col-md-6"
                component={InputField}
                label={I18n.t('COMMON.EXTERNAL_AFILIATE_ID')}
                inputAddon={<span className="icon-generate-password" />}
                inputAddonPosition="right"
                onIconClick={this.handleGenerateExternalId}
                type="text"
                showErrorMessage
              />
            </If>
          </div>
          <If
            condition={
              formValues.affiliateType
              && formValues.affiliateType !== affiliateTypes.NULLPOINT
            }
          >
            <Field
              name="public"
              className="col-6"
              component={CheckBox}
              type="checkbox"
              label={I18n.t('PARTNERS.MODALS.NEW_PARTNER.PUBLIC_CHECKBOX')}
            />
            <Regulated>
              <Field
                name="cellexpert"
                className="col-6"
                component={CheckBox}
                type="checkbox"
                label={I18n.t('PARTNERS.MODALS.NEW_PARTNER.CELLEXPERT_CHECKBOX')}
              />
            </Regulated>
          </If>
        </ModalBody>
        <ModalFooter className="modal-footer__create-partner">
          <div className="row">
            <div className="col-7">
              <button
                type="button"
                className="btn btn-default-outline"
                onClick={onCloseModal}
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </button>
              <button
                type="submit"
                disabled={pristine || submitting || !valid}
                className="btn btn-primary ml-2"
                id="create-new-operator-submit-button"
                form="create-operator-modal-form"
              >
                {I18n.t('COMMON.BUTTONS.CREATE_AND_OPEN')}
              </button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default CreatePartnerModal;
