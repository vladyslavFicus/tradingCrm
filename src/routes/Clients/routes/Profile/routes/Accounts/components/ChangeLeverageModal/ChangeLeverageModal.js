import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { Formik, Form, Field } from 'formik';
import { getActiveBrandConfig } from 'config';
import { withNotifications } from 'hoc';
import { Button } from 'components/UI';
import Badge from 'components/Badge';
import { FormikSelectField } from 'components/Formik';
import { accountTypesLabels } from 'constants/accountTypes';
import PropTypes from 'constants/propTypes';
import changeLeverageMutation from './graphql/ChangeLeverageRequestMutation';
import './ChangeLeverageModal.scss';

class ChangeLeverageModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    accountType: PropTypes.string,
    name: PropTypes.string,
    login: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    group: PropTypes.string,
    platformType: PropTypes.string,
    archived: PropTypes.bool,
    leverage: PropTypes.string,
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
    const { changeLeverage, notify, onCloseModal, accountUUID, refetchTradingAccountsList } = this.props;

    const { data: { tradingAccount: { changeLeverageRequest: { success } } } } = await changeLeverage({
      variables: {
        accountUUID,
        ...data,
      },
    });

    refetchTradingAccountsList();

    notify({
      level: success ? 'success' : 'error',
      title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.TITLE'),
      message: success
        ? I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.LEVERAGE_CHANGED')
        : I18n.t('COMMON.SOMETHING_WRONG'),
    });

    if (success) {
      onCloseModal();
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

    const brand = getActiveBrandConfig();

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
                  <div className="font-weight-700">
                    {name}
                  </div>
                </Badge>
                <div className="font-size-11">
                  {platformType}ID - {login}
                </div>
                <div className="font-size-11">
                  {group}
                </div>
                <p className="ChangeLeverageModal__message">
                  {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.MESSAGE')}
                </p>
                <div className="ChangeLeverageModal__inputs">
                  <Field
                    name="leverage"
                    className="ChangeLeverageModal__input ChangeLeverageModal__select"
                    placeholder={I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.CHANGE_LEVERAGE')}
                    label={I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.CHANGE_LEVERAGE')}
                    component={FormikSelectField}
                  >
                    {brand[`leveragesChangingRequest${platformType}`]
                      .filter(item => leverage !== item)
                      .map(value => <option key={value} value={value}>1:{value}</option>)}
                  </Field>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col">
                      <Button
                        className="ChangeLeverageModal__button"
                        commonOutline
                        onClick={onCloseModal}
                      >
                        {I18n.t('COMMON.CANCEL')}
                      </Button>
                      <Button
                        primary
                        disabled={!dirty || isSubmitting}
                        type="submit"
                      >
                        {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.CHANGE_LEVERAGE')}
                      </Button>
                    </div>
                  </div>
                </div>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default withRequests({
  changeLeverage: changeLeverageMutation,
})(withNotifications(ChangeLeverageModal));
