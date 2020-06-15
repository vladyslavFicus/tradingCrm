import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import MultiCurrencyField from '../MultiCurrencyValue/MultiCurrencyField';
import attributeLabels from './constants';
import './MultiCurrencyModal.scss';

class MultiCurrencyModal extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    optionCurrencies: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      options: PropTypes.shape({
        signUp: PropTypes.shape({
          currency: PropTypes.shape({
            list: PropTypes.arrayOf(PropTypes.string),
          }),
        }),
      }),
    }),
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    formValues: PropTypes.object,
  };

  static defaultProps = {
    label: '',
    formValues: {},
    optionCurrencies: { options: {}, loading: true },
  };

  componentWillReceiveProps({ isOpen }) {
    if (this.props.isOpen && !isOpen) {
      this.props.reset();
    }
  }

  get baseCurrency() {
    const { optionCurrencies: { options } } = this.props;

    return get(options, 'signUp.post.currency.base', '');
  }

  get secondaryCurrencies() {
    const { optionCurrencies: { options } } = this.props;

    return get(options, 'signUp.post.currency.rates', []);
  }

  get baseCurrencyValue() {
    return get(this.props.formValues, 'amounts[0].amount', 0);
  }

  handleChangeBase = ({ target: { value } } = { target: { value: '' } }) => {
    const baseCurrencyCode = this.baseCurrency;
    const baseCurrencyValue = value || this.baseCurrencyValue;

    this.secondaryCurrencies.forEach(({ amount, currency }, index) => {
      this.props.change(`amounts[${index + 1}].currency`, currency);
      this.props.change(`amounts[${index + 1}].amount`, (amount * baseCurrencyValue).toFixed(4));
    });

    this.props.change('amounts[0].currency', baseCurrencyCode);
  };

  handleSubmit = ({ amounts }) => {
    this.props.onSubmit(amounts);
  };

  render() {
    const {
      props: {
        handleSubmit,
        onCloseModal,
        isOpen,
        label,
        optionCurrencies: {
          loading,
        },
      },
      secondaryCurrencies,
      baseCurrency,
      baseCurrencyValue,
    } = this;

    return (
      <Modal toggle={onCloseModal} isOpen={isOpen} className="currency-calc-modal">
        <ModalHeader toggle={onCloseModal}>
          <i className="icon icon-currencies" />
          <span className="currency-calc-modal__title">{I18n.t(attributeLabels.title)}</span>
        </ModalHeader>
        <ModalBody tag="form" onSubmit={handleSubmit(this.handleSubmit)} id="currency-calc-modal-form">
          <div className="currency-calc-modal__input-wrapper">
            <div className="currency-calc-modal__input-label">
              {label}
            </div>
            <If condition={baseCurrency}>
              <div className="row no-gutters">
                <div className="col-auto currency-calc-modal__input-currency">
                  {baseCurrency}
                </div>
                <div className="col-4 px-3">
                  <MultiCurrencyField
                    name="amounts[0]"
                    disabled={loading}
                    currency={baseCurrency}
                    onChange={this.handleChangeBase}
                    className="mb-0"
                  />
                </div>
              </div>
            </If>
          </div>
          <div className="currency-calc-modal__output-wrapper">
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th>{I18n.t('COMMON.CURRENCY')}</th>
                  <th>{I18n.t(attributeLabels.rate)}</th>
                  <th>{I18n.t(attributeLabels.calculated)}</th>
                  <th>{I18n.t(attributeLabels.customized)}</th>
                </tr>
              </thead>
              <tbody>
                {secondaryCurrencies.map(({ currency, amount }, index) => (
                  <tr key={currency}>
                    <td>{currency}</td>
                    <td>{amount}</td>
                    <td>{(amount * baseCurrencyValue).toFixed(4)}</td>
                    <td>
                      <MultiCurrencyField
                        name={`amounts[${index + 1}]`}
                        currency={currency}
                        className="mb-0"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-default-outline"
            onClick={onCloseModal}
          >
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            form="currency-calc-modal-form"
          >
            {I18n.t('COMMON.BUTTONS.CONFIRM')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default MultiCurrencyModal;
