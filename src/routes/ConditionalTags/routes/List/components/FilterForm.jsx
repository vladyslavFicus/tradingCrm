import React, { Component } from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import PropTypes from 'prop-types';
import { createValidator } from '@newage/casino_backoffice_utils';
import { SelectField, FilterRow } from '@newage/casino_backoffice_ui';
import { I18n } from 'react-redux-i18n';
import Joi from 'joi-browser';
import { statuses } from '../../../constants';

const schema = Joi.object().keys({
  status: Joi.string(),
});
const validator = createValidator(schema, I18n, 'route.conditionalTags.component.FilterForm');

class FilterForm extends Component {
  static propTypes = {
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  handleReset = formData => {
    const { onReset } = this.props;

    formData.reset();
    onReset();
  };

  render() {
    const { onSubmit, disabled } = this.props;

    return (
      <Form
        onSubmit={onSubmit}
        validate={validator}
        keepDirtyOnReinitialize={false}
        render={({ handleSubmit, submitting, pristine }) => (
          <FormSpy subscription={{}}>
            {({ form }) => (
              <FilterRow
                resetBtnLabel={I18n.t('common.reset')}
                submitBtnLabel={I18n.t('common.apply')}
                submitting={submitting}
                className="filter-row"
                disabled={disabled}
                onSubmit={handleSubmit}
                onReset={() => this.handleReset(form)}
                pristine={pristine}
              >
                <Field
                  name="status"
                  label={I18n.t('conditionalTags.component.FilterForm.status')}
                  component={SelectField}
                  className="filter-row__small"
                >
                  <option value="">{I18n.t('common.any')}</option>
                  <For each="status" of={Object.keys(statuses)}>
                    <option
                      value={status}
                    >
                      {I18n.t(`conditionalTags.component.FilterForm.conditionStatus.${status}`)}
                    </option>
                  </For>
                </Field>
              </FilterRow>
            )}
          </FormSpy>
        )}
      />
    );
  }
}

export default FilterForm;
