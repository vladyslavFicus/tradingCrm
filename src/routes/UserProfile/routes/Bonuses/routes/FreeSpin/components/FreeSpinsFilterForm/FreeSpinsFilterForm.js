import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFormValues, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { createValidator } from '../../../../../../../../utils/validator';
import { attributeLabels, attributePlaceholders, authorTypesLabels } from './constants';
import { InputField, SelectField, SearchField, DateTimeField } from '../../../../../../../../components/ReduxForm';
import renderLabel from '../../../../../../../../utils/renderLabel';

class FreeSpinsFilterForm extends Component {
  static propTypes = {
    reset: PropTypes.func,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    currentValues: PropTypes.shape({
      searchBy: PropTypes.string,
      assign: PropTypes.string,
      providerId: PropTypes.string,
      gameId: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }),
    games: PropTypes.arrayOf(PropTypes.string).isRequired,
    providers: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  startDateValidator = toAttribute => (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues[toAttribute]
      ? current.isSameOrBefore(moment(currentValues[toAttribute]))
      : true;
  };

  endDateValidator = fromAttribute => (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues[fromAttribute]
      ? current.isSameOrAfter(moment(currentValues[fromAttribute]))
      : true;
  };

  handleReset = () => {
    this.props.reset();
    this.props.onReset();
  };

  render() {
    const {
      submitting,
      pristine,
      disabled,
      handleSubmit,
      onSubmit,
      providers,
      games,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="well">
          <div className="row">
            <div className="col-md-10">
              <div className="row">
                <div className="col-md-2">
                  <Field
                    name="searchBy"
                    label={I18n.t(attributeLabels.searchBy)}
                    placeholder={I18n.t(attributePlaceholders.searchBy)}
                    component={SearchField}
                  />
                </div>
                <div className="col-md-2">
                  <Field
                    name="assigned"
                    label={I18n.t(attributeLabels.assigned)}
                    labelClassName="form-label"
                    position="vertical"
                    component={SelectField}
                  >
                    <option value="">{I18n.t('COMMON.ANY')}</option>
                    {Object.keys(authorTypesLabels).map(item => (
                      <option key={item} value={item}>
                        {renderLabel(item, authorTypesLabels)}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="col-md-2">
                  <Field
                    name="providerId"
                    label={I18n.t(attributeLabels.providerId)}
                    labelClassName="form-label"
                    position="vertical"
                    component={SelectField}
                  >
                    <option value="">{I18n.t('COMMON.ANY')}</option>
                    {providers.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="col-md-2">
                  <Field
                    name="gameId"
                    label={I18n.t(attributeLabels.gameId)}
                    labelClassName="form-label"
                    position="vertical"
                    component={SelectField}
                  >
                    <option value="">{I18n.t('COMMON.ANY')}</option>
                    {games.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>{I18n.t(attributeLabels.availabilityDateRange)}</label>

                    <div className="row">
                      <div className="col-md-6">
                        <Field
                          name="startDate"
                          placeholder={I18n.t(attributeLabels.startDate)}
                          component={DateTimeField}
                          position="vertical"
                          isValidDate={this.startDateValidator('startDate')}
                        />
                      </div>
                      <div className="col-md-6">
                        <Field
                          name="endDate"
                          placeholder={I18n.t(attributeLabels.endDate)}
                          component={DateTimeField}
                          position="vertical"
                          isValidDate={this.endDateValidator('endDate')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-2 text-right">
              <div className="form-group margin-top-25">
                <button
                  disabled={submitting || (disabled && pristine)}
                  className="btn btn-default btn-sm margin-inline font-weight-700"
                  onClick={this.handleReset}
                  type="reset"
                >
                  {I18n.t('COMMON.RESET')}
                </button>
                <button
                  disabled={submitting || (disabled && pristine)}
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

const validatorAttributeLabels = Object.keys(attributeLabels).reduce((res, name) => ({
  ...res,
  [name]: I18n.t(attributeLabels[name]),
}), {});
const FORM_NAME = 'freeSpinsFilter';
const FilterForm = reduxForm({
  form: FORM_NAME,
  validate: createValidator({
    searchBy: 'string',
    aggregatorId: 'string',
    gameId: 'string',
    startDate: 'string',
    endDate: 'string',
  }, validatorAttributeLabels, false),
})(FreeSpinsFilterForm);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(FilterForm);
