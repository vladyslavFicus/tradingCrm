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
    destroy: PropTypes.func.isRequired,
    label: PropTypes.string,
  };

  static defaultProps = {
    label: '',
    optionCurrencies: { options: {} },
  };

  componentWillReceiveProps({ isOpen }) {
    if (this.props.isOpen && !isOpen) {
      this.props.destroy();
    }
  }

  handleChange = (currency, index) => ({ target: { value } }) => {
    const currencyFieldName = `amounts[${index}].currency`;
    const currencyCode = value ? currency : '';

    this.props.change(currencyFieldName, currencyCode);
  };

  handleSubmit = ({ amounts }) => {
    this.props.onSubmit(amounts);
  };

  renderField = (currency, index = 0) => (
    <MultiCurrencyField
      key={currency}
      name={`amounts[${index}]`}
      currency={currency}
      onChange={this.handleChange(currency, index)}
    />
  );

  render() {
    const {
      handleSubmit,
      onCloseModal,
      isOpen,
      optionCurrencies: {
        refetch,
        options,
      },
      label,
      formValues,
    } = this.props;
    const secondaryCurrencies = get(options, 'signUp.post.currency.rates', []);
    const baseCurrency = get(options, 'signUp.post.currency.base', '');
    const baseCurrencyValue = get(formValues, 'amounts[0].amount', 0);

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
                    {this.renderField(baseCurrency)}
                  </div>
                  <div className="currency-calc-modal__input-button">
                    <button type="button" onClick={() => refetch()} className="btn btn-primary-outline">
                      {I18n.t(attributeLabels.recalc)}
                    </button>
                    <div className="currency-calc-modal__input-warning">
                      {I18n.t(attributeLabels.recalcWarning)}
                    </div>
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
                        <td>{this.renderField(currency, index + 1)}</td>
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
