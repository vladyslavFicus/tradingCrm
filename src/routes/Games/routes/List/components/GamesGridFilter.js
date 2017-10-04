import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { SelectField } from '../../../../../components/ReduxForm';
import { createValidator } from '../../../../../utils/validator';
import { attributeLabels, attributePlaceholders } from '../constants';

const validator = createValidator({
  provider: 'string',
  gameType: 'string',
  platform: 'string',
  freeSpin: 'string',
}, attributeLabels, false);

class GamesGridFilter extends Component {
  static propTypes = {
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    currentValues: PropTypes.object,
    reset: PropTypes.func,
    onReset: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentValues: {},
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
      currentValues,
    } = this.props;

    {console.log(this.props)}

    return (
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="filter-row">
            <div className="filter-row__medium">
              <Field
                name="provider"
                label={attributeLabels.provider}
                component={SelectField}
                position="vertical"
              >
                <option value="">{attributePlaceholders.any}</option>
                {categories.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Field>
            </div>
            {/*<div className="filter-row__medium">
              <Field
                name="gameType"
                label={attributeLabels.gameType}
                component={SelectField}
                position="vertical"
              >
                <option value="">{attributePlaceholders.any}</option>
                {gameTypes.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <Field
                name="platform"
                label={attributeLabels.platform}
                component={SelectField}
                position="vertical"
              >
                <option value="">{attributePlaceholders.any}</option>
                {platforms.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Field>
            </div>*/}
            {/*<div className="filter-row__medium">
              <Field
                name="freeSpin"
                label={attributeLabels.freeSpin}
                component={SelectField}
                position="vertical"
              >
                <option value="">{attributePlaceholders.any}</option>
                {platforms.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Field>
            </div>*/}

            <div className="filter-row__button-block">
              <div className="button-block-container">
                <button
                  disabled={submitting}
                  className="btn btn-default"
                  onClick={this.handleReset}
                  type="reset"
                >
                  Reset
                </button>
                <button
                  disabled={submitting}
                  className="btn btn-primary"
                  type="submit"
                  id="operators-list-filters-apply-button"
                >
                  Apply
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
