import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import get from 'lodash/get';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
  SelectField,
  InputField,
} from '../../../../../components/ReduxForm';

class FreeSpinCreateModal extends PureComponent {
  static propTypes = {
    onSave: PropTypes.func,
    handleSubmit: PropTypes.func.isRequired,
    freeSpinOptions: PropTypes.shape({
      freeSpinOptions: PropTypes.object,
    }).isRequired,
    optionCurrencies: PropTypes.shape({
      options: PropTypes.shape({
        signUp: PropTypes.shape({
          currency: PropTypes.shape({
            list: PropTypes.arrayOf(PropTypes.string),
          }),
        }),
      }),
    }).isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    onSave: null,
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  };

  handleSubmit = (data) => {
    console.log('submit');
  };

  render() {
    const {
      handleSubmit,
      onCloseModal,
      isOpen,
      freeSpinOptions: {
        freeSpinOptions,
      },
      optionCurrencies: {
        options,
      },
    } = this.props;
    const { _reduxForm: { values: { aggregatorId } } } = this.context;

    const currencies = get(options, 'signUp.post.currency.list', []);
    const aggregatorOptions = freeSpinOptions || { };
    const providers = get(aggregatorOptions, `[${aggregatorId}].providers`, []);

    return (
      <Modal className="create-operator-modal" toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>Modal header</ModalHeader>

        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <ModalBody>
            <div className="row">
              <div className="col-md-6">
                <Field
                  name="currency"
                  label={I18n.t('COMMON.CURRENCY')}
                  type="select"
                  component={SelectField}
                  position="vertical"
                >
                  <option value="">{I18n.t('BONUS_CAMPAIGNS.SETTINGS.CHOOSE_CURRENCY')}</option>
                  {currencies.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
            <Field
              name={'name'}
              type="text"
              id={'freeSpinName'}
              placeholder=""
              label={'Name'}
              component={InputField}
              position="vertical"
            />
            <div className="row">
              <div className="col-4">
                <Field
                  name="aggregatorId"
                  id={'aggregatorId'}
                  label="Aggregator id"
                  position="vertical"
                  component={SelectField}
                  showErrorMessage={false}
                >
                  <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_AGGREGATOR')}</option>
                  {Object.keys(aggregatorOptions).map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-4">
                <Field
                  name="providerId"
                  id={'providerId'}
                  label="Provider id"
                  position="vertical"
                  component={SelectField}
                  showErrorMessage={false}
                >
                  <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_PROVIDER')}</option>
                  {providers.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="row">
              <div className="col-7">
                <button
                  type="submit"
                  className="btn btn-primary ml-2"
                  id="create-new-operator-submit-button"
                >
                  Save
                </button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default FreeSpinCreateModal;
