import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { Formik, Form, Field } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withRequests, parseErrors } from 'apollo';
import { getBrand } from 'config';
import { notify, LevelType } from 'providers/NotificationProvider';
import { generate } from 'utils/password';
import { createValidator, translateLabels } from 'utils/validator';
import {
  getAvailablePlatformTypes,
  getAvailableAccountTypes,
  getPlarformSupportedCurrencies,
  getPlatformDefaultCurrency,
} from 'utils/tradingAccount';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import PropTypes from 'constants/propTypes';
import { attributeLabels, amounts } from './constants';
import UpdateTradingAccountModalMutation from './graphql/UpdateTradingAccountModalMutation';

const validator = values => createValidator({
  name: ['required', 'string', 'max:50', 'min:4'],
  currency: ['required', 'string'],
  password: values.platformType !== 'WET' && ['required', `regex:${getBrand().password.mt4_pattern}`],
  amount: values.accountType === 'DEMO' && 'required',
}, translateLabels(attributeLabels), false)(values);

class TradingAccountAddModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    createTradingAccount: PropTypes.func.isRequired,
    profileId: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
  };

  onSubmit = async (data) => {
    const {
      onCloseModal,
      createTradingAccount,
      profileId,
      onSuccess,
    } = this.props;

    try {
      await createTradingAccount({
        variables: {
          ...data,
          profileId,
          // Remove password field from request for WET accounts
          password: data.platformType !== 'WET' ? data.password : undefined,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.TITLE'),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.SUCCESSFULLY_CREATED'),
      });

      onSuccess();
      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.TITLE'),
        message: I18n.t(error.error) || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  handleChangePlatformType = ({ accountType }, setFieldValue) => (platformType) => {
    const availableAccountTypes = getAvailableAccountTypes(platformType);

    // If previous accountType not found for new chosen platformType --> choose first from list
    if (!availableAccountTypes.find(type => type?.value === accountType)) {
      setFieldValue('accountType', availableAccountTypes?.[0]?.value);
    }

    setFieldValue('platformType', platformType);
    setFieldValue('currency', getPlatformDefaultCurrency(platformType));
  };

  render() {
    const { isOpen, onCloseModal } = this.props;

    const platformTypes = getAvailablePlatformTypes();
    const platformType = platformTypes?.[0]?.value;

    const accountType = getAvailableAccountTypes(platformType).find(type => type?.value === 'LIVE') ? 'LIVE' : 'DEMO';

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <Formik
          initialValues={{
            platformType,
            accountType,
            name: '',
            currency: getPlatformDefaultCurrency(platformType),
            password: generate(),
          }}
          validate={validator}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={this.onSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => {
            const accountTypes = getAvailableAccountTypes(values.platformType);

            return (
              <Form>
                <ModalHeader toggle={onCloseModal}>
                  {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.TITLE')}
                </ModalHeader>
                <ModalBody>
                  <If condition={platformTypes.length > 1}>
                    <Field
                      name="platformType"
                      component={FormikSelectField}
                      label={I18n.t(attributeLabels.platformType)}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                      customOnChange={this.handleChangePlatformType(values, setFieldValue)}
                    >
                      {platformTypes.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </Field>
                  </If>
                  <If condition={accountTypes.length > 1}>
                    <Field
                      name="accountType"
                      component={FormikSelectField}
                      label={attributeLabels.accountType}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    >
                      {accountTypes.map(({ value, label }) => (
                        <option key={value} value={value}>{I18n.t(label)}</option>
                      ))}
                    </Field>
                  </If>
                  <If condition={values.accountType === 'DEMO'}>
                    <Field
                      name="amount"
                      component={FormikSelectField}
                      label={attributeLabels.amount}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    >
                      {amounts.map(value => (
                        <option key={value} value={value}>
                          {I18n.toNumber(value, { precision: 0 })}
                        </option>
                      ))}
                    </Field>
                  </If>
                  <Field
                    name="name"
                    type="text"
                    label={attributeLabels.name}
                    component={FormikInputField}
                    placeholder={attributeLabels.name}
                  />
                  <Field
                    name="currency"
                    component={FormikSelectField}
                    label={attributeLabels.currency}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  >
                    {getPlarformSupportedCurrencies(values.platformType).map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </Field>
                  <If condition={values.platformType !== 'WET'}>
                    <Field
                      name="password"
                      component={FormikInputField}
                      label={attributeLabels.password}
                      placeholder={attributeLabels.password}
                      addition={<span className="icon-generate-password" />}
                      onAdditionClick={() => setFieldValue('password', generate())}
                    />
                  </If>
                </ModalBody>
                <ModalFooter>
                  <Button
                    tertiary
                    onClick={onCloseModal}
                  >
                    {I18n.t('COMMON.CANCEL')}
                  </Button>
                  <Button
                    type="submit"
                    primary
                    disabled={isSubmitting}
                  >
                    {I18n.t('COMMON.CONFIRM')}
                  </Button>
                </ModalFooter>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    );
  }
}

export default compose(
  withRequests({
    createTradingAccount: UpdateTradingAccountModalMutation,
  }),
)(TradingAccountAddModal);
