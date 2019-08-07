import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { SelectField } from '../../../../components/ReduxForm';
import { accessTypes, accessTypeLabels } from '../../../../constants/countries';
import { createValidator, translateLabels } from '../../../../utils/validator';
import renderLabel from '../../../../utils/renderLabel';
import { attributeLabels } from './constants';

class CountriesGridFilter extends Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    handleSubmit: null,
    submitting: false,
  };

  handleReset = () => {
    this.props.reset();
    this.props.onSubmit();
  };

  render() {
    const { submitting, handleSubmit, onSubmit } = this.props;

    return (
      <form className="filter-row" onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="access"
          label={I18n.t(attributeLabels.access)}
          component={SelectField}
          className="filter-row__medium"
        >
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {Object.keys(accessTypes).map(key => (
            <option key={key} value={key}>
              {renderLabel(key, accessTypeLabels)}
            </option>
          ))}
        </Field>
        <div className="filter-row__button-block">
          <button
            disabled={submitting}
            className="btn btn-default"
            onClick={this.handleReset}
            type="button"
          >
            {I18n.t('COMMON.RESET')}
          </button>
          <button
            disabled={submitting}
            className="btn btn-primary"
            type="submit"
          >
            {I18n.t('COMMON.APPLY')}
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'filterCountries',
  validate: createValidator({
    access: ['string', `in:,${Object.keys(accessTypes).join()}`],
  }, translateLabels(attributeLabels), false),
})(CountriesGridFilter);
