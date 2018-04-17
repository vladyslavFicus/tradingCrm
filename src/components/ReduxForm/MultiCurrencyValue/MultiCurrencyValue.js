import { compose } from 'redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMultiCurrencyModal } from '../../../components/HighOrder';
import MultiCurrencyField from './MultiCurrencyField';
import { floatNormalize } from '../../../utils/inputNormalize';

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
    currencies: [{
      amount: 0,
      currency: this.props.baseCurrency,
    }],
  };

  setFields = (currencies) => {
    const { _reduxForm: { autofill } } = this.context;

    this.setState({
      currencies,
    }, () => {
      autofill(this.props.baseName, this.state.currencies);
    });
  };

  handleChangeBaseCurrencyAmount = ({ target: { value } }) => {
    const currencies = this.state.currencies;
    currencies[0] = {
      amount: floatNormalize(value),
      currency: this.props.baseCurrency,
    };

    this.setFields(currencies);
  };

  handleSubmitMultiCurrencyForm = (currencies) => {
    this.setFields(currencies);

    this.props.modals.multiCurrencyModal.hide();
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
        amounts: this.state.currencies,
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
      <MultiCurrencyField
        name={`${baseName}[0]`}
        label={label}
        currency={baseCurrency}
        onChange={this.handleChangeBaseCurrencyAmount}
        iconRightClassName="nas nas-currencies_icon"
        onIconClick={this.handleOpenModal}
      />
    );
  }
}

export default compose(
  withMultiCurrencyModal,
)(MultiCurrencyValue);
