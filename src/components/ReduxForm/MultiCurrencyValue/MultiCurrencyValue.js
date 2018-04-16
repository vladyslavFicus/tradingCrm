import { compose } from 'redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMultiCurrencyModal } from '../../../components/HighOrder';
import MultiCurrencyField from './MultiCurrencyField';

class MultiCurrencyValue extends Component {
  static propTypes = {
    currencies: PropTypes.arrayOf(PropTypes.string),
    baseCurrency: PropTypes.string,
    baseName: PropTypes.string,
    modals: PropTypes.shape({
      multiCurrencyModal: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
    label: PropTypes.string,
  };

  static defaultProps = {
    currencies: [],
    baseCurrency: '',
    baseName: 'amounts',
    label: 'Amount',
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  };

  state = {
    amount: 0,
    currency: this.props.baseCurrency,
  };

  change = (field, value) => {
    const { _reduxForm: { autofill } } = this.context;
    autofill(field, value);
  };

  handleChangeBaseCurrencyAmount = ({ target: { value: amount } }) => {
    const { baseName, baseCurrency } = this.props;

    const baseCurrencyField = `${baseName}[0].currency`;
    const baseCurrencyValue = amount ? baseCurrency : '';

    this.setState({
      amount: parseFloat(amount),
    }, this.change(baseCurrencyField, baseCurrencyValue));
  };

  handleSubmitMultiCurrencyForm = (data) => {
    const { baseName, modals } = this.props;

    this.change(baseName, data);
    modals.multiCurrencyModal.hide();
  };

  handleOpenModal = () => {
    const {
      modals,
      baseCurrency,
      currencies,
      label,
    } = this.props;

    modals.multiCurrencyModal.show({
      onSubmit: this.handleSubmitMultiCurrencyForm,
      baseCurrency,
      currencies,
      label,
      initialValues: {
        amounts: [this.state],
      },
    });
  };

  render() {
    const {
      baseName,
      baseCurrency,
      label,
    } = this.props;

    return (
      <div>
        <MultiCurrencyField
          name={`${baseName}[0]`}
          label={label}
          currency={baseCurrency}
          onChange={this.handleChangeBaseCurrencyAmount}
          iconRightClassName="nas nas-currencies_icon"
          onIconClick={this.handleOpenModal}
        />
      </div>
    );
  }
}

export default compose(
  withMultiCurrencyModal,
)(MultiCurrencyValue);
