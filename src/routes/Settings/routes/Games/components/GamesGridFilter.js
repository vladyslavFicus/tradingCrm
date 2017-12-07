import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { SelectField, NasSelectField } from '../../../../../components/ReduxForm';
import { createValidator } from '../../../../../utils/validator';
import attributeLabels from '../constants';
import { typeLabels, gameProviderLabels, withLinesLabels } from '../../../../../constants/games';
import renderLabel from '../../../../../utils/renderLabel';

class GamesGridFilter extends Component {
  static propTypes = {
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    withLines: PropTypes.object.isRequired,
    type: PropTypes.object.isRequired,
    gameProvider: PropTypes.object.isRequired,
    reset: PropTypes.func,
    onReset: PropTypes.func.isRequired,
  };

  static defaultProps = {
    submitting: false,
    handleSubmit: null,
    reset: null,
  };

  handleReset = () => {
    this.props.reset();
    this.props.onReset();
  };

  render() {
    const {
      submitting,
      handleSubmit,
      onSubmit,
      withLines,
      type,
      gameProvider,
    } = this.props;

    return (
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="filter-row">
            <div className="filter-row__medium">
              <Field
                name="gameProvider"
                label={I18n.t(attributeLabels.gameProvider)}
                component={SelectField}
                position="vertical"
              >
                <option value="">{I18n.t('COMMON.ANY')}</option>
                {Object.keys(gameProvider).map(item => (
                  <option key={item} value={gameProvider[item]}>
                    {renderLabel(item, gameProviderLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <Field
                name="type"
                label={I18n.t(attributeLabels.type)}
                component={SelectField}
                placeholder={I18n.t('COMMON.ANY')}
                position="vertical"
              >
                <option value="">{I18n.t('COMMON.ANY')}</option>
                {Object.keys(type).map(item => (
                  <option key={item} value={type[item]}>
                    {renderLabel(item, typeLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <Field
                name="withLines"
                label={I18n.t(attributeLabels.withLines)}
                component={SelectField}
                placeholder={I18n.t('COMMON.ANY')}
                position="vertical"
              >
                <option value="">{I18n.t('COMMON.ANY')}</option>
                {Object.keys(withLines).map(item => (
                  <option key={item} value={item}>
                    {renderLabel(item, withLinesLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__button-block">
              <div className="button-block-container">
                <button
                  disabled={submitting}
                  className="btn btn-default"
                  onClick={this.handleReset}
                  type="reset"
                >
                  {I18n.t('COMMON.RESET')}
                </button>
                <button
                  disabled={submitting}
                  className="btn btn-primary"
                  type="submit"
                  id="operators-list-filters-apply-button"
                >
                  {I18n.t('COMMON.APPLY')}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'gamesGridFilter',
  validate: createValidator({
    gameProvider: 'string',
    gameType: 'string',
    platform: 'string',
    freeSpinAvailability: 'string',
  }, attributeLabels, false),
})(GamesGridFilter);
