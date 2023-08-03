import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import I18n from 'i18n-js';
import { Formik, Form, FormikHelpers, FormikErrors } from 'formik';
import { parseErrors } from 'apollo';
import { getAvailableLanguages } from 'config';
import { AcquisitionStatusTypes__Enum as AcquisitionStatusTypes } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { ruleTypes, priorities } from 'constants/rules';
import { attributeLabels, customErrors, nestedFieldsNames } from 'constants/ruleModal';
import { decodeNullValues } from 'components/Formik/utils';
import { createValidator, translateLabels } from 'utils/validator';
import countryList from 'utils/countryList';
import { Button } from 'components/Buttons';
import Modal from 'components/Modal';
import StaticTabs from 'components/StaticTabs';
import StaticTabsItem from 'components/StaticTabsItem';
import Uuid from 'components/Uuid';
import RuleSettings from 'components/RuleSettings';
import RuleSchedule from './components/RuleSchedule';
import { FormValues } from './types';
import { nestedFieldsTranslator, extraValidation } from './utils';
import { useRulesQuery } from './graphql/__generated__/RulesQuery';
import { useOperatorsSubordinatesQuery } from './graphql/__generated__/OperatorsSubordinatesQuery';
import { usePartnersQuery } from './graphql/__generated__/PartnersQuery';
import { useUpdateRuleMutation } from './graphql/__generated__/UpdateRuleMutation';
import './UpdateRuleModal.scss';

export type Props = {
  uuid: string,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const UpdateRuleModal = (props: Props) => {
  const { uuid, onSuccess, onCloseModal } = props;

  const navigate = useNavigate();

  const [validationOnChangeEnabled, setValidationOnChangeEnabled] = useState<boolean>(false);
  const [validationSchedulesEnabled, setValidationSchedulesEnabled] = useState<boolean>(false);

  // ===== Requests ===== //
  const { data } = useRulesQuery({ variables: { uuids: [uuid] } });

  const {
    name,
    type,
    priority,
    countries,
    languages,
    sources,
    enableSchedule,
    partners: currentPartners,
    operatorSpreads: currentOperatorSpreads,
    schedules: currentSchedules,
  } = data?.rules?.[0] || {};

  const operatorsSubordinatesQuery = useOperatorsSubordinatesQuery({
    variables: { hierarchyTypeGroup: AcquisitionStatusTypes.SALES },
  });
  const operators = operatorsSubordinatesQuery.data?.operatorsSubordinates || [];

  const partnersQuery = usePartnersQuery();
  const partners = partnersQuery.data?.partners?.content || [];

  const [updateRuleMutation] = useUpdateRuleMutation();

  // ===== Handlers ===== //
  const handleFindDuplicate = (createdByOrUuid: string) => {
    onCloseModal();
    navigate('/sales-rules', {
      state: {
        filters: { createdByOrUuid },
      },
    });
  };

  const handleSubmit = async (
    { operatorSpreads, schedules, ...values }: FormValues,
    { setErrors }: FormikHelpers<FormValues>,
  ) => {
    try {
      await updateRuleMutation(
        {
          variables: {
            uuid,
            ...operatorSpreads && {
              operatorSpreads: [
                // the filter needs to delete an empty value in array
                ...operatorSpreads.filter(item => item && item.percentage),
              ],
            },
            // update schedules only if it's changed to prevent sending default schedule body
            ...validationSchedulesEnabled && { schedules },
            ...decodeNullValues(values),
          },
        },
      );

      onSuccess();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_UPDATED'),
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_NOT_UPDATED'),
      });

      let _error = error.error;

      if (error.error === 'error.entity.already.exist') {
        _error = (
          <>
            <Button
              type="button"
              onClick={() => handleFindDuplicate(error.errorParameters.ruleUuid)}
            >
              {I18n.t(`rules.${error.error}`, error.errorParameters)}
            </Button>

            <Uuid uuid={error.errorParameters.ruleUuid} uuidPrefix="RL" />
          </>
        );
      }

      setErrors({ submit: _error } as FormikErrors<FormValues>);
    }
  };

  const enableSchedulesValidation = () => {
    setValidationSchedulesEnabled(true);
  };

  // ===== Effects ===== //
  useEffect(() => {
    if (enableSchedule) {
      enableSchedulesValidation();
    }
  }, [enableSchedule]);

  return (
    <Formik
      initialValues={{
        name: name || '',
        type,
        priority: priority || 0,
        countries: countries || [],
        languages: languages || [],
        sources,
        affiliateUUIDs: (currentPartners || []).map(partner => partner.uuid),
        ...currentOperatorSpreads && { operatorSpreads: currentOperatorSpreads },
        enableSchedule: enableSchedule || false,
        schedules: (currentSchedules?.length && currentSchedules) || [
          {
            days: [],
            timeIntervals: [
              {
                operatorSpreads: [],
                timeFrom: '00:00',
                timeTo: '00:00',
              },
            ],
          },
        ],
      } as FormValues}
      validate={(values) => {
        const errors = createValidator({
          name: ['required', 'string'],
          priority: ['required', `in:${priorities.join()}`],
          countries: [`in:${Object.keys(countryList).join()}`],
          languages: [`in:${getAvailableLanguages().join()}`],
          'operatorSpreads.*.percentage': ['between:1,100', 'integer'],
          ...currentOperatorSpreads && { 'operatorSpreads.0.parentUser': 'required' },
          type: ['required', `in:${ruleTypes.map(({ value }) => value).join()}`],
          ...validationSchedulesEnabled && {
            'schedules.*.timeIntervals.*.operatorSpreads.*.percentage': ['between:1,100', 'integer'],
            'schedules.*.timeIntervals.*.operatorSpreads.0.parentUser': ['required'],
          },
        }, translateLabels(attributeLabels), false, customErrors)(values);

        return nestedFieldsTranslator(
          extraValidation(values, errors, validationSchedulesEnabled),
          nestedFieldsNames,
        );
      }}
      validateOnBlur={false}
      validateOnChange={validationOnChangeEnabled}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, dirty, isSubmitting, errors, initialValues, setFieldValue, submitForm }) => (
        <Modal
          onCloseModal={onCloseModal}
          title={I18n.t('HIERARCHY.PROFILE_RULE_TAB.EDIT_MODAL.HEADER')}
          disabled={!dirty || isSubmitting}
          clickSubmit={() => {
            setValidationOnChangeEnabled(true);
            submitForm();
          }}
          buttonTitle={I18n.t('HIERARCHY.PROFILE_RULE_TAB.EDIT_MODAL.SAVE_CHANGES')}
        >
          <Form>
            <div className="UpdateRuleModal__body">
              <StaticTabs>
                <StaticTabsItem label={I18n.t('RULE_MODAL.SETTINGS_TAB_NAME')}>
                  <RuleSettings
                    formikBag={{ isSubmitting, errors, setFieldValue }}
                    operators={operators}
                    partners={partners}
                    operatorSpreads={values.operatorSpreads}
                  />
                </StaticTabsItem>

                <StaticTabsItem label={I18n.t('RULE_MODAL.SCHEDULE_TAB_NAME')}>
                  <RuleSchedule
                    operators={operators}
                    values={values}
                    formikBag={{ initialValues, isSubmitting, errors, setFieldValue }}
                    validationSchedulesEnabled={validationSchedulesEnabled}
                    enableSchedulesValidation={enableSchedulesValidation}
                  />
                </StaticTabsItem>
              </StaticTabs>
            </div>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(UpdateRuleModal);
