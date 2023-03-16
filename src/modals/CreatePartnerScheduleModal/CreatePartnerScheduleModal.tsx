import React, { useState } from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Formik, Form, Field, FieldArray, FieldArrayRenderProps, FormikHelpers } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { SetFieldValue } from 'types/formik';
import { Partner__Schedule__CountrySpreads as CountrySpreads } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import countryList from 'utils/countryList';
import { Button, TrashButton } from 'components/Buttons';
import { decodeNullValues } from 'components/Formik/utils';
import { FormikInputField, FormikSelectField, FormikTimeRangeField } from 'components/Formik';
import { attributeLabels, validate } from './constants';
import { useCreateScheduleMutation } from './graphql/__generated__/CreateScheduleMutation';
import './CreatePartnerScheduleModal.scss';

type FormValues = {
  totalLimit: number,
  workingHoursFrom: string,
  workingHoursTo: string,
  countrySpreads: Array<CountrySpreads>,
};

export type Props = {
  activated: boolean,
  day: string,
  affiliateUuid: string,
  countrySpreads: Array<CountrySpreads>,
  workingHoursFrom?: string | null,
  workingHoursTo?: string | null,
  totalLimit?: number | null,
  onCloseModal: () => void,
  refetch: () => void,
};

const CreatePartnerScheduleModal = (props: Props) => {
  const {
    day,
    workingHoursFrom = '',
    workingHoursTo = '',
    totalLimit = 0,
    countrySpreads,
    activated,
    affiliateUuid,
    refetch,
    onCloseModal,
  } = props;

  const countries = countrySpreads.map(({ country }) => country);

  const [selectedCountries, setSelectedCountries] = useState<Array<string>>(countries);
  const [limitError, setLimitError] = useState<boolean>(false);

  const [createScheduleMutation] = useCreateScheduleMutation();

  const onHandleSubmit = async ({
    totalLimit: newTotalLimit,
    countrySpreads: newCountrySpreads,
    ...rest
  }: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    const limitSum = newCountrySpreads.reduce((a, b) => a + (b.limit || 0), 0);

    if (newTotalLimit
      && limitSum > newTotalLimit
      && !!selectedCountries.length
    ) {
      setLimitError(true);
    } else {
      setLimitError(false);

      try {
        await createScheduleMutation({
          variables: {
            day,
            activated,
            totalLimit,
            affiliateUuid,
            countrySpreads: [
              // filter need for delete empty value in array
              ...newCountrySpreads.filter((item: CountrySpreads) => item && item.limit),
            ],
            ...decodeNullValues({ newTotalLimit, ...rest }),
          },
        });

        refetch();
        onCloseModal();

        notify({
          level: LevelType.SUCCESS,
          title: I18n.t('PARTNERS.MODALS.SCHEDULE.NOTIFICATIONS.CREATE.TITLE'),
          message: I18n.t('COMMON.SUCCESS'),
        });
      } catch (e) {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('PARTNERS.MODALS.SCHEDULE.NOTIFICATIONS.CREATE.TITLE'),
          message: I18n.t('COMMON.ERROR'),
        });
      }
    }

    setSubmitting(false);
  };

  const onHandleSelect = (index: number,
    name: string,
    value: string,
    setFieldValue: SetFieldValue<FormValues>,
    arrayHelpers: FieldArrayRenderProps) => {
    setSelectedCountries([...selectedCountries, value]);

    arrayHelpers.insert(index, '');

    setFieldValue(name, value);
  };

  return (
    <Modal
      toggle={onCloseModal}
      isOpen
    >
      <Formik
        initialValues={{
          workingHoursFrom: workingHoursFrom || '00:00',
          workingHoursTo: workingHoursTo || '00:00',
          totalLimit,
          countrySpreads: [...countrySpreads, ''],
        } as FormValues}
        validate={validate}
        onSubmit={onHandleSubmit}
      >
        {(
          {
            dirty,
            isValid,
            isSubmitting,
            values: {
              countrySpreads: currentCountrySpreads,
              totalLimit: currentLimitError,
            },
            setFieldValue,
          },
        ) => (
          <Form className="CreatePartnerScheduleModal">
            <ModalHeader toggle={onCloseModal}>
              {`${I18n.t(`PARTNERS.SCHEDULE.WEEK.${day}`)} ${I18n.t('PARTNERS.MODALS.SCHEDULE.TITLE')}`}
            </ModalHeader>

            <ModalBody>
              <p className="CreatePartnerScheduleModal__description">
                {I18n.t('PARTNERS.MODALS.SCHEDULE.MESSAGE')}
              </p>

              <Field
                component={FormikTimeRangeField}
                fieldsNames={{
                  from: 'workingHoursFrom',
                  to: 'workingHoursTo',
                }}
                fieldsLabels={{
                  from: I18n.t(attributeLabels.workingHoursFrom),
                  to: I18n.t(attributeLabels.workingHoursTo),
                }}
              />

              <Field
                name="totalLimit"
                type="number"
                min={0}
                label={I18n.t(attributeLabels.leadsLimit)}
                placeholder={I18n.t(attributeLabels.leadsLimit)}
                component={FormikInputField}
              />

              <FieldArray
                name="countrySpreads"
                render={arrayHelpers => (
                  <>
                    <div className="CreatePartnerScheduleModal__spread">
                      <span className="CreatePartnerScheduleModal__label">
                        {I18n.t(attributeLabels.country)}
                      </span>

                      <span className="CreatePartnerScheduleModal__label">
                        {I18n.t(attributeLabels.countryLimit)}
                      </span>
                    </div>

                    {currentCountrySpreads.map(({ country }, index) => (
                      <div className="CreatePartnerScheduleModal__spread" key={index}>
                        <Field
                          name={`countrySpreads[${index}].country`}
                          component={FormikSelectField}
                          customOnChange={(value: string) => onHandleSelect(
                            index,
                            `countrySpreads[${index}].country`,
                            value,
                            setFieldValue,
                            arrayHelpers,
                          )}
                          disabled={isSubmitting}
                          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                          searchable
                        >
                          {Object.entries(countryList).map(([key, value]) => (
                            <option
                              key={key}
                              value={key}
                              className={
                                    classNames('CreatePartnerScheduleModal__options-item', {
                                      'CreatePartnerScheduleModal--is-disabled': selectedCountries.indexOf(key) !== -1,
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
                          disabled={isSubmitting || !currentCountrySpreads[index]}
                          component={FormikInputField}
                          className={
                            classNames({
                              'CreatePartnerScheduleModal__input--has-error': limitError,
                            })
                              }
                        />

                        <If condition={selectedCountries.length > 0 && selectedCountries.length !== index}>
                          <TrashButton
                            className="CreatePartnerScheduleModal__button"
                            onClick={() => {
                              arrayHelpers.remove(index);
                              selectedCountries.splice(selectedCountries.indexOf(country), 1);

                              setSelectedCountries(selectedCountries);
                            }}
                          />
                        </If>
                      </div>
                    ))}
                  </>
                )}
              />

              <If condition={limitError}>
                <div className="CreatePartnerScheduleModal__limit-error">
                  {I18n.t('PARTNERS.MODALS.SCHEDULE.LIMIT_ERROR', { currentLimitError })}
                </div>
              </If>
            </ModalBody>

            <ModalFooter>
              <Button
                tertiary
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
};

export default React.memo(CreatePartnerScheduleModal);