import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { SelectField, NasSelectField } from '../../../../../components/ReduxForm';
import { createValidator } from '../../../../../utils/validator';
import { attributeLabels } from '../constants';
import { typeLabels, gameProviderLabels, withLinesLabels } from '../../../../../constants/games';
import renderLabel from '../../../../../utils/renderLabel';

const validator = createValidator({
  gameProvider: 'string',
  category: 'string',
  type: 'string',
  withLines: 'string',
}, attributeLabels, false);

class GamesGridFilter extends Component {
  static propTypes = {
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    withLines: PropTypes.object.isRequired,
    type: PropTypes.arrayOf(PropTypes.string).isRequired,
    gameProvider: PropTypes.arrayOf(PropTypes.string).isRequired,
    reset: PropTypes.func,
    onReset: PropTypes.func.isRequired,
  };

  static defaultProps = {
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
      categories,
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
                <option value="">{I18n.t('COMMON.ALL')}</option>
                {Object.keys(gameProvider).map(item => (
                  <option key={item} value={gameProvider[item]}>
                    {renderLabel(gameProvider[item], gameProviderLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <Field
                name="category"
                label={I18n.t(attributeLabels.category)}
                component={NasSelectField}
                placeholder={I18n.t('COMMON.ANY')}
                position="vertical"
              >
                {Object.keys(categories).map(item => (
                  <option key={item} value={categories[item]}>
                    {categories[item]}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <Field
                name="type"
                label={I18n.t(attributeLabels.type)}
                component={NasSelectField}
                placeholder={I18n.t('COMMON.ANY')}
                position="vertical"
              >
                {Object.keys(type).map(item => (
                  <option key={item} value={type[item]}>
                    {renderLabel(type[item], typeLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <Field
                name="withLines"
                label={I18n.t(attributeLabels.withLines)}
                component={NasSelectField}
                placeholder={I18n.t('COMMON.ANY')}
                position="vertical"
              >
                {Object.keys(withLines).map(item => (
                  <option key={item} value={item}>
                    {renderLabel(withLines[item], withLinesLabels)}
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
  validate: validator,
})(GamesGridFilter);
