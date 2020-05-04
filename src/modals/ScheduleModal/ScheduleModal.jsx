/* eslint-disable */

import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Formik, Form, Field, FieldArray } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'constants/propTypes';
import { createValidator, translateLabels } from 'utils/validator';
import countryList from 'utils/countryList';
import { Button } from 'components/UI';
import {
  FormikInputField,
  FormikSelectField,
} from 'components/Formik';
import { attributeLabels, customErrors } from './constants';
import './ScheduleModal.scss';

const validate = createValidator({
  workingHoursFrom: ['required', 'string'],
  workingHoursTo: ['required', 'string'],
  totalLimit: ['string'],
}, translateLabels(attributeLabels), false);

class ScheduleModal extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    formError: PropTypes.string,
    currentDay: PropTypes.string,
  };

  state = {
    selectedCountries: [],
    limitError: false,
  };

  onHandleSubmit = ({ totalLimit, countrySpreads }, { setSubmitting, setErrors }) => {
    if (totalLimit
      && countrySpreads.reduce((a, b) => a + (b.countryLimit || 0), 0) > totalLimit
      && this.state.selectedCountries.length !== 0
    ) {
      this.setState({ limitError: true });
    } else {
      this.setState({ limitError: false });

      // this.props.onSubmit(values, setErrors);
    }
    setSubmitting(false);
  };

  onHandleSelect = (index, name, value, setFieldValue, arrayHelpers) => {
    const { selectedCountries } = this.state;

    this.setState({ selectedCountries: [...selectedCountries, value] });

    arrayHelpers.insert(index, '');

    setFieldValue(name, value);
  };

  render() {
    const {
      selectedCountries,
      limitError,
    } = this.state;

    const {
      onCloseModal,
      isOpen,
      formError,
      currentDay,
    } = this.props;

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <Formik
          initialValues={{
            workingHoursFrom: '00:00',
            workingHoursTo: '00:00',
            totalLimit: '',
            countrySpreads: [''],
          }}
          validate={validate}
          onSubmit={this.onHandleSubmit}
        >
          {({ errors, dirty, isValid, isSubmitting, values: { countrySpreads }, setFieldValue }) => (
            <Form className="ScheduleModal">
              <ModalHeader toggle={onCloseModal}>
                {`${currentDay} ${I18n.t('PARTNERS.MODALS.SCHEDULE.TITLE')}`}
              </ModalHeader>
              <ModalBody>
                <If condition={formError || (errors && errors.submit)}>
                  <div className="mb-2 text-center color-danger ScheduleModal__message-error">
                    {formError || errors.submit}
                  </div>
                </If>
                <div className="row">
                  <Field
                    name="workingHoursFrom"
                    type="time"
                    label={I18n.t(attributeLabels.workingHoursFrom)}
                    dateFormat={null}
                    className="col-lg"
                    component={FormikInputField}
                  />
                  <Field
                    name="workingHoursTo"
                    type="time"
                    label={I18n.t(attributeLabels.workingHoursTo)}
                    dateFormat={null}
                    className="col-lg"
                    component={FormikInputField}
                  />
                  </div>
                <Field
                  name="totalLimit"
                  label={I18n.t(attributeLabels.leadsLimit)}
                  placeholder={I18n.t(attributeLabels.leadsLimit)}
                  component={FormikInputField}
                />
                <div className="row">
                  <FieldArray
                    name="countrySpreads"
                    render={arrayHelpers => (
                      <Fragment>
                        {countrySpreads.map(({ country }, index) => (
                          <Fragment key={index}>
                            <Field
                              name={`countrySpreads[${index}].country`}
                              label={index === 0 ? I18n.t(attributeLabels.country) : ''}
                              component={FormikSelectField}
                              customOnChange={value => this.onHandleSelect(
                                index,
                                `countrySpreads[${index}].country`,
                                value,
                                setFieldValue,
                                arrayHelpers,
                              )}
                              className="col-7"
                              disabled={isSubmitting}
                              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                              searchable
                            >
                              {Object.entries(countryList).map(([key, value]) => (
                                  <option
                                    key={key}
                                    value={value}
                                    className={
                                      classNames('select-block__options-item', {
                                        'ScheduleModal--is-disabled': selectedCountries.indexOf(value) !== -1,
                                      })
                                    }
                                  >
                                    {value}
                                  </option>
                                ))
                              }
                            </Field>
                            <Field
                              name={`countrySpreads[${index}].countryLimit`}
                              type="number"
                              placeholder={I18n.t(attributeLabels.countryLimit)}
                              label={index === 0 ? I18n.t(attributeLabels.countryLimit) : ''}
                              disabled={isSubmitting || !countrySpreads[index]}
                              component={FormikInputField}
                              className={
                                classNames('col-4', {
                                  'input--has-error': limitError,
                                })
                              }
                            />
                            <If condition={selectedCountries.length > 0 && selectedCountries.length !== index}>
                              <Button
                                transparent
                                className="ScheduleModal__button"
                                onClick={() => {
                                  arrayHelpers.remove(index);
                                  selectedCountries.splice(selectedCountries.indexOf(country), 1);

                                  this.setState({
                                    selectedCountries,
                                  });
                                }}
                              >
                                <i className="fa fa-trash btn-transparent color-danger" />
                              </Button>
                            </If>
                          </Fragment>
                        ))}
                      </Fragment>
                    )}
                  />
                  <If condition={limitError}>
                    <div className="ScheduleModal__limit-error color-danger">
                      <div className="col-7">
                        {I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.PERCENTAGE_LIMIT_ERROR')}
                      </div>
                    </div>
                  </If>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  commonOutline
                  onClick={onCloseModal}
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  primary
                  type="submit"
                  disabled={!dirty || !isValid || isSubmitting}
                >
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default ScheduleModal;
