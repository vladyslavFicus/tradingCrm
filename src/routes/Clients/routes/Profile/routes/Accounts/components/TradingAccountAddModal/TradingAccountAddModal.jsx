import React, { PureComponent } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { compose } from 'react-apollo';
import { Formik, Form, Field } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withNotifications } from 'hoc';
import { getActiveBrandConfig } from 'config';
import { generate } from 'utils/password';
import { createValidator, translateLabels } from 'utils/validator';
import { getAvailablePlatformTypes, getAvailableAccountTypes } from 'utils/tradingAccount';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import PropTypes from 'constants/propTypes';
import { attributeLabels } from './constants';
import { UpdateTradingAccountModalMutation } from './graphql';
import './TradingAccountAddModal.scss';

const validator = ({ accountType }) => createValidator({
  name: ['required', 'string', 'max:50', 'min:4'],
  currency: ['required', 'string'],
  password: ['required', `regex:${getActiveBrandConfig().password.mt4_pattern}`],
  amount: accountType === 'DEMO' && 'required',
}, translateLabels(attributeLabels), false);

class TradingAccountAddModal extends PureComponent {
  static propTypes = {
    profileId: PropTypes.string.isRequired,
    error: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    createTradingAccount: PropTypes.func.isRequired,
    onConfirm: PropTypes.func,
    notify: PropTypes.func.isRequired,
  };

  static defaultProps = {
    error: null,
    onConfirm: () => { },
  };

  onSubmit = async (data) => {
    const { profileId, createTradingAccount, notify, onCloseModal, onConfirm } = this.props;

    const { data: { tradingAccount: { create: { success, error } } } } = await createTradingAccount({
      variables: {
        ...data,
        profileId,
      },
    });

    notify({
      level: success ? 'success' : 'error',
      title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.TITLE'),
      message: success
        ? I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.SUCCESSFULLY_CREATED')
        : I18n.t(error.error) || I18n.t('COMMON.SOMETHING_WRONG'),
    });

    if (success) {
      onCloseModal();
      onConfirm();
    }
  };

  render() {
    const {
      onCloseModal,
      isOpen,
      error,
    } = this.props;

    const platformTypes = getAvailablePlatformTypes();
    const platformType = get(getAvailablePlatformTypes(), '0.value');
    const accountTypes = getAvailableAccountTypes(platformType);

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <Formik
          initialValues={{
            platformType: get(getAvailablePlatformTypes(), '0.value'),
            accountType: accountTypes.find(type => get(type, 'value') === 'LIVE') ? 'LIVE' : 'DEMO',
            name: '',
            currency: '',
            password: generate(),
          }}
          validate={validator}
          onSubmit={this.onSubmit}
        >
          {({ isSubmitting, isValid, setFieldValue, values: { accountType } }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.TITLE')}
              </ModalHeader>
              <ModalBody>
                <If condition={error}>
                  <div className="mb-2 text-center color-danger">
                    {error}
                  </div>
                </If>
                <If condition={platformTypes.length > 1}>

                  <Field
                    name="platformType"
                    component={FormikSelectField}
                    label={I18n.t(attributeLabels.platformType)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    customOnChange={(value) => {
                      setFieldValue('platformType', value);

                      const availableAccountTypes = getAvailableAccountTypes(value);

                      // If previous accountType not found for new chosen platformType --> choose first from list
                      if (!availableAccountTypes.find(type => get(type, 'value') === accountType)) {
                        setFieldValue('accountType', get(availableAccountTypes, '0.value'));
                      }
                    }}
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
                <If condition={accountType === 'DEMO'}>
                  <Field
                    name="amount"
                    component={FormikSelectField}
                    label={attributeLabels.amount}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  >
                    {[100, 500, 1000, 5000, 10000, 50000, 100000].map(value => (
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
                  {getActiveBrandConfig().currencies.supported.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
                <Field
                  name="password"
                  component={FormikInputField}
                  label={attributeLabels.password}
                  placeholder={attributeLabels.password}
                  addition={<span className="icon-generate-password" />}
                  onAdditionClick={() => setFieldValue('password', generate())}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  commonOutline
                  onClick={onCloseModal}
                >
                  {I18n.t('COMMON.CANCEL')}
                </Button>
                <Button
                  type="submit"
                  primary
                  disabled={isSubmitting || !isValid}
                >
                  {I18n.t('COMMON.CONFIRM')}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    createTradingAccount: UpdateTradingAccountModalMutation,
  }),
)(TradingAccountAddModal);
