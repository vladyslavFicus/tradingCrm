import React, { Component } from 'react';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withFormik, Form, Field } from 'formik';
import PropTypes from 'constants/propTypes';
import { FormikSelectField } from 'components/Formik';
import isQuestionDisabled from '../utils';

class RisksQuestionnaire extends Component {
  static propTypes = {
    values: PropTypes.objectOf(PropTypes.string),
    setFieldValue: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    questionnaireData: PropTypes.riskQuestionnaireData.isRequired,
  };

  static defaultProps = {
    values: {},
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
    const { values, questionnaireData } = this.props;
    const { hasValidationErrors } = this.state;

    const disabledQuestions = get(questionnaireData, 'disabledQuestions') || [];

    const name = `questionId-${questionId}`;
    const fieldClassName = classNames('risk__form-field', {
      'col-6': questions.length > 1,
      'col-12': questions.length === 1,
    });

    const disabled = isQuestionDisabled(questionId, values, disabledQuestions);

    return (
      <Field
        key={name}
        name={name}
        className={fieldClassName}
        component={FormikSelectField}
        label={`${questionId}. ${title}`}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
        customTouched={hasValidationErrors}
        customOnChange={value => this.onHandleSelect(name, value)}
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
            const value = JSON.stringify({
              questionId,
              answerId: selectedAnswers.length > 0 ? selectedAnswers[0].id : null,
            });

            initialValues[key] = value;
          },
        ),
      ),
    );

    return initialValues;
  },
  validate: (values, props) => {
    const { questionnaireData: { disabledQuestions } } = props;
    const errors = {};
    const errorMessage = I18n.t('ERRORS.FIELD_IS_REQUIRED');

    Object.keys(values).forEach((questionName) => {
      const { questionId, answerId } = JSON.parse(values[questionName]) || {};
      const disabled = isQuestionDisabled(questionId, values, disabledQuestions);

      if (!answerId && !disabled) {
        errors[questionName] = errorMessage;
      }
    });

    return errors;
  },
  displayName: 'RisksQuestionnaire',
})(RisksQuestionnaire);
