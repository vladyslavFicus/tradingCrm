import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createValidator } from '../../../utils/validator';
import MultiCurrencyField from './MultiCurrencyField';
import attributeLabels from './constants';
import './MultiCurrencyModal.scss';

class MultiCurrencyModal extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    baseCurrency: PropTypes.string.isRequired,
    label: PropTypes.string,
  };

  static defaultProps = {
    label: '',
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
      key={index}
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
      currencies,
      baseCurrency,
      label,
    } = this.props;

    const secondaryCurrencies = currencies.filter(c => c !== baseCurrency);

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
                <div className="currency-calc-modal__input-currency">
                  {baseCurrency}
                </div>
                <div className="currency-calc-modal__input-input">
                  {this.renderField(baseCurrency)}
                </div>
              </div>
            </div>
            <div className="currency-calc-modal__output">
              <table className="table table-responsive">
                <thead>
                  <tr>
                    <th className="currency-calc-modal__output-header">{I18n.t('COMMON.CURRENCY')}</th>
                    <th className="currency-calc-modal__output-header">{I18n.t(attributeLabels.customized)}</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    secondaryCurrencies.map((currency, index) => (
                      <tr key={currency}>
                        <td className="currency-calc-modal__output-content">{currency}</td>
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

export default reduxForm({
  enableReinitialize: true,
  form: 'multiCurrencyModal',
  validate: (values, { currencies }) => {
    const rules = {};

    for (let i = 0; i < currencies.length; i += 1) {
      rules[`amounts[${i}].amount`] = ['numeric', 'min: 0'];
    }

    return createValidator(rules, false)(values);
  },
})(MultiCurrencyModal);
