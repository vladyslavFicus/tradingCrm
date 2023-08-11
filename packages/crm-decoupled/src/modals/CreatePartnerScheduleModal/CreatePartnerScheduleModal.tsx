import React, { useState } from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Formik, Form, Field, FieldArray, FieldArrayRenderProps, FormikHelpers } from 'formik';
import { Utils, notify, Types } from '@crm/common';
import { TrashButton } from 'components';
import { Partner__Schedule__CountrySpreads as CountrySpreads } from '__generated__/types';
import Modal from 'components/Modal';
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
          level: Types.LevelType.SUCCESS,
          title: I18n.t('PARTNERS.MODALS.SCHEDULE.NOTIFICATIONS.CREATE.TITLE'),
          message: I18n.t('COMMON.SUCCESS'),
        });
      } catch (e) {
        notify({
          level: Types.LevelType.ERROR,
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
    setFieldValue: Types.SetFieldValue<FormValues>,
    arrayHelpers: FieldArrayRenderProps) => {
    setSelectedCountries([...selectedCountries, value]);

    arrayHelpers.insert(index, '');

    setFieldValue(name, value);
  };

  return (
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
          submitForm,
        },
      ) => (
        <Modal
          onCloseModal={onCloseModal}
          title={`${I18n.t(`PARTNERS.SCHEDULE.WEEK.${day}`)} ${I18n.t('PARTNERS.MODALS.SCHEDULE.TITLE')}`}
          disabled={!dirty || !isValid || isSubmitting}
          clickSubmit={submitForm}
          buttonTitle={I18n.t('COMMON.SAVE_CHANGES')}
        >
          <Form className="CreatePartnerScheduleModal">
            <p className="CreatePartnerScheduleModal__description">
              {I18n.t('PARTNERS.MODALS.SCHEDULE.MESSAGE')}
            </p>

            <Field
              data-testid="CreatePartnerScheduleModal-workingHoursTimeRange"
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
              data-testid="CreatePartnerScheduleModal-totalLimitInput"
              label={I18n.t(attributeLabels.leadsLimit)}
              placeholder={I18n.t(attributeLabels.leadsLimit)}
              component={FormikInputField}
            />

            <FieldArray
              name="countrySpreads"
              data-testid="CreatePartnerScheduleModal-countrySpreadsArray"
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
                        data-testid={`CreatePartnerScheduleModal-countrySpreads[${index}]CountryInput`}
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
                        {Object.entries(Utils.countryList).map(([key, value]) => (
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
                        data-testid={`CreatePartnerScheduleModal-countrySpreads[${index}]LimitInput`}
                      />

                      <If condition={selectedCountries.length > 0 && selectedCountries.length !== index}>
                        <TrashButton
                          className="CreatePartnerScheduleModal__button"
                          data-testid="CreatePartnerScheduleModal-trashButton"
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
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(CreatePartnerScheduleModal);
