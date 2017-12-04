import React, { Component, PropTypes } from 'react';
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="well">
          <div className="row">
            <div className="col-md-10">
              <div className="row">
                <div className="col-md-4">
                  <Field
                    name="access"
                    label={I18n.t(attributeLabels.access)}
                    labelClassName="form-label"
                    component={SelectField}
                    position="vertical"
                  >
                    <option value="">-- {I18n.t('COMMON.ANY')} --</option>
                    {Object.keys(accessTypes).map(key =>
                      <option key={key} value={key}>
                        { renderLabel(key, accessTypeLabels) }
                      </option>
                    )}
                  </Field>
                </div>
              </div>
            </div>

            <div className="col-md-2">
              <div className="form-group margin-top-25">
                <button
                  disabled={submitting}
                  className="btn btn-default btn-sm margin-inline font-weight-700"
                  onClick={this.handleReset}
                  type="reset"
                >
                  {I18n.t('COMMON.RESET')}
                </button>
                <button
                  disabled={submitting}
                  className="btn btn-primary btn-sm margin-inline font-weight-700"
                  type="submit"
                >
                  {I18n.t('COMMON.APPLY')}
                </button>
              </div>
            </div>
          </div>
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
