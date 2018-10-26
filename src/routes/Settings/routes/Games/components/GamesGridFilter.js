import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { InputField, SelectField } from '../../../../../components/ReduxForm';
import { createValidator } from '../../../../../utils/validator';
import { attributeLabels, attributePlaceholders } from '../constants';
import { typeLabels, gameProviderLabels, withLinesLabels } from '../../../../../constants/games';
import renderLabel from '../../../../../utils/renderLabel';

class GamesGridFilter extends Component {
  static propTypes = {
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    withLines: PropTypes.object.isRequired,
    type: PropTypes.object.isRequired,
    gameProvider: PropTypes.arrayOf(PropTypes.string).isRequired,
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
      <form className="filter-row" onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="keyword"
          type="text"
          label={I18n.t(attributeLabels.keyword)}
          placeholder={I18n.t(attributePlaceholders.keyword)}
          inputAddon={<i className="icon icon-search" />}
          component={InputField}
          className="filter-row__big"
        />
        <Field
          name="gameProvider"
          label={I18n.t(attributeLabels.gameProvider)}
          component={SelectField}
          className="filter-row__medium"
        >
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {gameProvider.map(item => (
            <option key={item} value={item}>
              {renderLabel(item, gameProviderLabels)}
            </option>
          ))}
        </Field>
        <Field
          name="type"
          label={I18n.t(attributeLabels.type)}
          component={SelectField}
          placeholder={I18n.t('COMMON.ANY')}
          className="filter-row__medium"
        >
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {Object.keys(type).map(item => (
            <option key={item} value={type[item]}>
              {renderLabel(item, typeLabels)}
            </option>
          ))}
        </Field>
        <Field
          name="withLines"
          label={I18n.t(attributeLabels.withLines)}
          component={SelectField}
          placeholder={I18n.t('COMMON.ANY')}
          className="filter-row__medium"
        >
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {Object.keys(withLines).map(item => (
            <option key={item} value={item}>
              {renderLabel(item, withLinesLabels)}
            </option>
          ))}
        </Field>
        <div className="filter-row__button-block">
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
          >
            {I18n.t('COMMON.APPLY')}
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'gamesGridFilter',
  validate: createValidator({
    keyword: 'string',
    gameProvider: 'string',
    gameType: 'string',
    platform: 'string',
    freeSpinAvailability: 'string',
  }, attributeLabels, false),
})(GamesGridFilter);
