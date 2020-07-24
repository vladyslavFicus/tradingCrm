import React, { PureComponent, Fragment } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Formik, Form, Field, FieldArray } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { createValidator, translateLabels } from 'utils/validator';
import { decodeNullValues } from 'components/Formik/utils';
import countryList from 'utils/countryList';
import { Button } from 'components/UI';
import {
  FormikInputField,
  FormikSelectField,
} from 'components/Formik';
import { attributeLabels } from './constants';
import createScheduleMutation from './graphql/createScheduleMutation';
import './PartnerScheduleModal.scss';

const validate = createValidator({
  workingHoursFrom: ['required', 'string'],
  workingHoursTo: ['required', 'string'],
}, translateLabels(attributeLabels), false);

class PartnerScheduleModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    refetch: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    createSchedule: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    activated: PropTypes.bool.isRequired,
    day: PropTypes.string.isRequired,
    affiliateUuid: PropTypes.string.isRequired,
    formError: PropTypes.string,
    workingHoursFrom: PropTypes.string,
    workingHoursTo: PropTypes.string,
    totalLimit: PropTypes.number,
    countrySpreads: PropTypes.arrayOf(PropTypes.shape({
      country: PropTypes.string,
      limit: PropTypes.number,
    })).isRequired,
  };

  static defaultProps = {
    workingHoursFrom: '',
    workingHoursTo: '',
    formError: '',
    totalLimit: 0,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedCountries: this.props.countrySpreads.map(({ country }) => country),
      limitError: false,
    };
  }

  onHandleSubmit = async ({
    totalLimit,
    countrySpreads,
    ...rest
  }, { setSubmitting }) => {
    const {
      activated,
      day,
      affiliateUuid,
      onCloseModal,
      refetch,
      notify,
    } = this.props;

    const limitSum = countrySpreads.reduce((a, b) => a + (b.limit || 0), 0);

    if (totalLimit
      && limitSum > totalLimit
      && this.state.selectedCountries.length !== 0
    ) {
      this.setState({ limitError: true });
    } else {
      this.setState({ limitError: false });

      try {
        await this.props.createSchedule({
          variables: {
            day,
            activated,
            totalLimit,
            affiliateUuid,
            countrySpreads: [
              // filter need for delete empty value in array
              ...countrySpreads.filter(item => item && item.limit),
            ],
            ...decodeNullValues({ totalLimit, ...rest }),
          },
        });

        refetch();
        onCloseModal();

        notify({
          level: 'success',
          title: I18n.t('PARTNERS.MODALS.SCHEDULE.NOTIFICATIONS.CREATE.TITLE'),
          message: I18n.t('COMMON.SUCCESS'),
        });
      } catch (e) {
        notify({
          level: 'error',
          title: I18n.t('PARTNERS.MODALS.SCHEDULE.NOTIFICATIONS.CREATE.TITLE'),
          message: I18n.t('COMMON.ERROR'),
        });
      }
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
      day,
      workingHoursFrom,
      workingHoursTo,
      totalLimit,
    } = this.props;

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <Formik
          initialValues={{
            workingHoursFrom: workingHoursFrom || '00:00',
            workingHoursTo: workingHoursTo || '00:00',
            totalLimit,
            countrySpreads: [...this.props.countrySpreads, ''],
          }}
          validate={validate}
          onSubmit={this.onHandleSubmit}
        >
          {({ errors, dirty, isValid, isSubmitting, values: { countrySpreads }, setFieldValue }) => (
            <Form className="PartnerScheduleModal">
              <ModalHeader toggle={onCloseModal}>
                {`${I18n.t(`PARTNERS.SCHEDULE.WEEK.${day}`)} ${I18n.t('PARTNERS.MODALS.SCHEDULE.TITLE')}`}
              </ModalHeader>
              <ModalBody>
                <p className="margin-bottom-15 text-center">
                  {I18n.t('PARTNERS.MODALS.SCHEDULE.MESSAGE')}
                </p>
                <If condition={formError || (errors && errors.submit)}>
                  <div className="mb-2 text-center color-danger PartnerScheduleModal__message-error">
                    {formError || errors.submit}
                  </div>
                </If>
                <div className="row">
                  <Field
                    name="workingHoursFrom"
                    label={I18n.t(attributeLabels.workingHoursFrom)}
                    placeholder="00:00"
                    className="col-lg"
                    component={FormikInputField}
                  />
                  <Field
                    name="workingHoursTo"
                    label={I18n.t(attributeLabels.workingHoursTo)}
                    placeholder="00:00"
                    className="col-lg"
                    component={FormikInputField}
                  />
                </div>
                <Field
                  name="totalLimit"
                  type="number"
                  min={0}
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
                                  value={key}
                                  className={
                                    classNames('select-block__options-item', {
                                      'PartnerScheduleModal--is-disabled': selectedCountries.indexOf(key) !== -1,
                                    })
                                  }
                                >
                                  {value}
                                </option>
                              ))
                              }
                            </Field>
                            <Field
                              name={`countrySpreads[${index}].limit`}
                              type="number"
                              min={0}
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
                                className="PartnerScheduleModal__button"
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
                    <div className="PartnerScheduleModal__limit-error color-danger">
                      <div className="col-7">
                        {I18n.t('PARTNERS.MODALS.SCHEDULE.LIMIT_ERROR', { totalLimit })}
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

export default compose(
  withNotifications,
  withRequests({
    createSchedule: createScheduleMutation,
  }),
)(PartnerScheduleModal);
