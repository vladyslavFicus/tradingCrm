import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { Formik, Form, Field } from 'formik';
import { getBrand } from 'config';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import { getPlatformTypeLabel } from 'utils/tradingAccount';
import PropTypes from 'constants/propTypes';
import { accountTypesLabels } from 'constants/accountTypes';
import { Button } from 'components/UI';
import Badge from 'components/Badge';
import { FormikSelectField } from 'components/Formik';
import ChangeLeverageMutation from './graphql/ChangeLeverageMutation';
import './ChangeLeverageModal.scss';

class ChangeLeverageModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    changeLeverage: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    accountType: PropTypes.string,
    name: PropTypes.string,
    login: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    group: PropTypes.string,
    platformType: PropTypes.string,
    archived: PropTypes.bool,
    leverage: PropTypes.string,
    accountUUID: PropTypes.string.isRequired,
  };

  static defaultProps = {
    platformType: '',
    accountType: '',
    name: '',
    group: '',
    archived: false,
    leverage: '',
  };

  onSubmit = async (data) => {
    const {
      onCloseModal,
      notify,
      changeLeverage,
      onSuccess,
      accountUUID,
    } = this.props;

    try {
      await changeLeverage({
        variables: {
          accountUUID,
          ...data,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.TITLE'),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.LEVERAGE_CHANGED'),
      });

      onSuccess();
      onCloseModal();
    } catch {
      notify({
        level: 'error',
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  render() {
    const {
      onCloseModal,
      isOpen,
      name,
      login,
      group,
      accountType,
      platformType,
      archived,
      leverage,
    } = this.props;

    const brand = getBrand();

    return (
      <Modal className="ChangeLeverageModal" toggle={onCloseModal} isOpen={isOpen}>
        <Formik
          initialValues={{ leverage: '' }}
          onSubmit={this.onSubmit}
        >
          {({ dirty, isSubmitting }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.CHANGE_LEVERAGE')}
              </ModalHeader>
              <ModalBody>
                <div className="ChangeLeverageModal__title">
                  {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.TRADING_ACCOUNT')}
                </div>
                <Badge
                  text={I18n.t(archived ? 'CONSTANTS.ARCHIVED' : accountTypesLabels[accountType].label)}
                  info={accountType === 'DEMO' && !archived}
                  success={accountType === 'LIVE' && !archived}
                  danger={archived}
                >
                  <div className="ChangeLeverageModal__account-name">
                    {name}
                  </div>
                </Badge>
                <div className="ChangeLeverageModal__account-details">
                  {getPlatformTypeLabel(platformType)} ID - {login}
                </div>
                <div className="ChangeLeverageModal__account-details">
                  {group}
                </div>
                <p className="ChangeLeverageModal__message">
                  {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.MESSAGE')}
                </p>

                <Field
                  name="leverage"
                  label={I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.CHANGE_LEVERAGE')}
                  placeholder={I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.CHANGE_LEVERAGE')}
                  component={FormikSelectField}
                >
                  {brand[platformType.toLowerCase()].leveragesChangingRequest
                    .filter(item => leverage !== item)
                    .map(value => (
                      <option key={value} value={value}>1:{value}</option>
                    ))}
                </Field>
              </ModalBody>
              <ModalFooter>
                <div className="ChangeLeverageModal__buttons">
                  <Button
                    className="ChangeLeverageModal__button"
                    onClick={onCloseModal}
                    tertiary
                  >
                    {I18n.t('COMMON.CANCEL')}
                  </Button>
                  <Button
                    className="ChangeLeverageModal__button"
                    disabled={!dirty || isSubmitting}
                    type="submit"
                    primary
                  >
                    {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.CHANGE_LEVERAGE')}
                  </Button>
                </div>
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
    changeLeverage: ChangeLeverageMutation,
  }),
)(ChangeLeverageModal);
