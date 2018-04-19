import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
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
      this.props.change(`amounts[${index + 1}].amount`, (amount * baseCurrencyValue).toFixed(2));
    });

    this.props.change('amounts[0].currency', baseCurrencyCode);
  };

  handleSubmit = ({ amounts }) => {
    this.props.onSubmit(amounts);
  };

  render() {
    const {
      handleSubmit,
      onCloseModal,
      isOpen,
      label,
      optionCurrencies: {
        loading,
      },
    } = this.props;
    const secondaryCurrencies = this.secondaryCurrencies;
    const baseCurrency = this.baseCurrency;
    const baseCurrencyValue = this.baseCurrencyValue;

    return (
      <Modal toggle={onCloseModal} isOpen={isOpen} className="currency-calc-modal">
        <ModalHeader toggle={onCloseModal}>
          <i className="nas nas-currencies_icon" />
          <span className="currency-calc-modal-header">{I18n.t(attributeLabels.title)}</span>
        </ModalHeader>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <ModalBody>
            <div className="currency-calc-modal__input">
              <div className="currency-calc-modal__input-label">
                {label}
              </div>
              <div className="currency-calc-modal__input-wrapper">
                <If condition={baseCurrency}>
                  <div className="currency-calc-modal__input-currency">
                    {baseCurrency}
                  </div>
                  <div className="currency-calc-modal__input-input">
                    <MultiCurrencyField
                      name={'amounts[0]'}
                      disabled={loading}
                      currency={baseCurrency}
                      onChange={this.handleChangeBase}
                    />
                  </div>
                </If>
              </div>
            </div>
            <div className="currency-calc-modal__output">
              <table className="table table-responsive">
                <thead>
                  <tr>
                    <th className="currency-calc-modal__output-header">{I18n.t('COMMON.CURRENCY')}</th>
                    <th className="currency-calc-modal__output-header">{I18n.t(attributeLabels.rate)}</th>
                    <th className="currency-calc-modal__output-header">{I18n.t(attributeLabels.calculated)}</th>
                    <th className="currency-calc-modal__output-header">{I18n.t(attributeLabels.customized)}</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    secondaryCurrencies.map(({ currency, amount }, index) => (
                      <tr key={currency}>
                        <td className="currency-calc-modal__output-content"><b>{currency}</b></td>
                        <td className="currency-calc-modal__output-content">{amount}</td>
                        <td className="currency-calc-modal__output-content">{(amount * baseCurrencyValue).toFixed(2)}</td>
                        <td>
                          <MultiCurrencyField
                            name={`amounts[${index + 1}]`}
                            currency={currency}
                          />
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-default-outline margin-right-10" onClick={onCloseModal}>
              {I18n.t('COMMON.BUTTONS.CANCEL')}
            </button>
            <button className="btn btn-primary" type="submit">
              {I18n.t('COMMON.BUTTONS.CONFIRM')}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default MultiCurrencyModal;
