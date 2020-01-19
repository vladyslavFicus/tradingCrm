import React, { Component } from 'react';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withFormik, Form, Field } from 'formik';
import PropTypes from 'constants/propTypes';
import { FormikSelectField } from 'components/Formik';

class RisksQuestionnaire extends Component {
  static propTypes = {
    values: PropTypes.objectOf(PropTypes.string),
    touched: PropTypes.objectOf(PropTypes.string),
    setFieldValue: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    questionnaireData: PropTypes.riskQuestionnaireData.isRequired,
  };

  static defaultProps = {
    values: {},
    touched: {},
  };

  state = {
    hasValidationErrors: false,
  };

  onHandleClick = actionType => async () => {
    const {
      values,
      validateForm,
      onHandleCalculate,
      onHandleSave,
    } = this.props;

    const validationResult = await validateForm(values);
    const hasValidationErrors = Object.keys(validationResult).length > 0;

    if (!hasValidationErrors) {
      if (actionType === 'Calculate') {
        onHandleCalculate(values);
      } else {
        onHandleSave(values);
      }
    }

    this.setState({ hasValidationErrors });
  };

  onHandleSelect = (name, value) => {
    const { setFieldValue } = this.props;

    setFieldValue(name, value);

    if (name === 'questionId-1' || name === 'questionId-2') {
      this.setState({ hasValidationErrors: false });
    }
  }

  renderQuestionnaireGroup = ({ questionSubGroups, id }) => (
    questionSubGroups.map(
      questionSubGroup => this.renderQuestionnaireSubGroup(questionSubGroup, id),
    )
  );

  renderQuestionnaireSubGroup = ({ id, title, questions }, groupId) => {
    const subGroupClassNames = classNames('risk__subgroup', {
      'col-12': questions.length > 1,
      'col-6': questions.length === 1,
    });

    return (
      <div
        className={subGroupClassNames}
        key={`group-${groupId}-subgroup-${id}`}
      >
        <If condition={title}>
          <div className="risk__form-heading">{title}</div>
        </If>

        <div className="row">
          {questions.map(question => this.renderSelectField(question, questions))}
        </div>
      </div>
    );
  }

  renderSelectField = ({ id: questionId, title, answers }, questions) => {
    const {
      values,
      touched,
    } = this.props;
    const { hasValidationErrors } = this.state;

    const name = `questionId-${questionId}`;

    let disabled = false;

    if (questionId > 1) {
      const { answerId: firstQuestionAnswerId } = JSON.parse(values['questionId-1']) || {};
      const { answerId: secondQuestionAnswerId } = JSON.parse(values['questionId-2']) || {};
      const { answerId: sixteenQuestionAnswerId } = JSON.parse(values['questionId-16']) || {};

      if (firstQuestionAnswerId !== 3) {
        disabled = true;
      }

      if (questionId > 2 && secondQuestionAnswerId !== 2) {
        disabled = true;
      }

      if (questionId === 17 && sixteenQuestionAnswerId === 1) {
        disabled = true;
      }
    }

    return (
      <Field
        key={name}
        name={name}
        className={classNames('risk__form-field', {
          'col-6': questions.length > 1,
          'col-12': questions.length === 1,
        })}
        label={`${questionId}. ${title}`}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
        customTouched={hasValidationErrors || touched[name]}
        onChange={value => this.onHandleSelect(name, value)}
        component={FormikSelectField}
        disabled={disabled}
      >
        {answers.map(({ id: answerId, title: answerTitle }) => (
          <option
            key={`questionId-${questionId}-answerId-${answerId}`}
            value={JSON.stringify({ questionId, answerId })}
          >
            {answerTitle}
          </option>
        ))}
      </Field>
    );
  }

  render() {
    const {
      isSubmitting,
      handleSubmit,
      questionnaireData,
    } = this.props;

    const questionGroups = get(questionnaireData, 'questionnaire.questionGroups') || [];

    const firstQuestionnaireGroup = questionGroups[0];
    const otherQuestionnaireGroups = [...questionGroups].splice(1);

    return (
      <Form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body risk__group row">
            {this.renderQuestionnaireGroup(firstQuestionnaireGroup)}
          </div>
        </div>

        <div className="card">
          <div className="card-body risk__group row">
            {otherQuestionnaireGroups.map(questionnaireGroup => this.renderQuestionnaireGroup(questionnaireGroup))}

            <div className="risk__form-buttons col-6">
              <button
                className="btn btn-primary risk__form-button"
                onClick={this.onHandleClick('Calculate')}
                disabled={isSubmitting}
                type="button"
              >
                {I18n.t('CLIENT_PROFILE.RISKS.TAB.BUTTONS.CALCULATE')}
              </button>

              <button
                className="btn btn-primary risk__form-button"
                onClick={this.onHandleClick('Save')}
                disabled={isSubmitting}
                type="button"
              >
                {I18n.t('CLIENT_PROFILE.RISKS.TAB.BUTTONS.SAVE')}
              </button>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

export default withFormik({
  mapPropsToValues: (props) => {
    const questionGroups = get(props, 'questionnaireData.questionnaire.questionGroups') || [];
    const initialValues = {};

    questionGroups.forEach(
      ({ questionSubGroups }) => questionSubGroups.forEach(
        ({ questions }) => questions.forEach(
          ({ answers, id: questionId }) => {
            const selectedAnswers = answers.filter(answer => answer.selected);
            const key = `questionId-${questionId}`;
            const value = selectedAnswers.length > 0
              ? JSON.stringify({ questionId, answerId: selectedAnswers[0].id })
              : '{}';

            initialValues[key] = value;
          },
        ),
      ),
    );

    return initialValues;
  },
  validate: (values) => {
    const errors = {};
    const errorMessage = I18n.t('ERRORS.FIELD_IS_REQUIRED');

    const firstQuestionValue = JSON.parse(values['questionId-1']) || {};
    const secondQuestionValue = JSON.parse(values['questionId-2']) || {};
    const sixteenQuestionValue = JSON.parse(values['questionId-16']) || {};

    if (!firstQuestionValue.answerId) {
      errors['questionId-1'] = errorMessage;
    }

    if (firstQuestionValue.answerId === 3 && !secondQuestionValue.answerId) {
      errors['questionId-2'] = errorMessage;
    }

    if (firstQuestionValue.answerId === 3 && secondQuestionValue.answerId === 2) {
      Object.keys(values).forEach((questionName, key) => {
        const { answerId } = JSON.parse(values[questionName]) || {};

        if (
          key > 1
          && !answerId
          && !(key === 16 && sixteenQuestionValue.answerId === 1)
        ) {
          errors[questionName] = errorMessage;
        }
      });
    }

    return errors;
  },
  displayName: 'RisksQuestionnaire',
})(RisksQuestionnaire);
