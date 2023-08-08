import React, { useState } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, FormikHelpers, FormikErrors } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Button } from 'components';
import { Config } from '@crm/common';
import { parseErrors } from 'apollo';
import {
  Operator,
  Partner,
  RuleOperatorSpread__Input as OperatorSpread,
  AcquisitionStatusTypes__Enum as AcquisitionStatusTypes,
} from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { ruleTypes, priorities } from 'constants/rules';
import { attributeLabels, customErrors } from 'constants/ruleModal';
import { createValidator, translateLabels } from 'utils/validator';
import countryList from 'utils/countryList';
import { decodeNullValues } from 'components/Formik/utils';
import StaticTabs from 'components/StaticTabs';
import StaticTabsItem from 'components/StaticTabsItem';
import Uuid from 'components/Uuid';
import Modal from 'components/Modal';
import RuleSettings from 'components/RuleSettings';
import CreateRuleSchedule from './components/CreateRuleSchedule';
import { extraValidation } from './utils';
import { useCreateRuleMutation } from './graphql/__generated__/CreateRuleMutation';
import { usePartnersQuery } from './graphql/__generated__/PartnersQuery';
import { useOperatorsSubordinatesQuery } from './graphql/__generated__/OperatorsSubordinatesQuery';
import './CreateRuleModal.scss';

export type FormValues = {
  name: string,
  type: string,
  priority: string,
  countries: Array<string>,
  languages: Array<string>,
  sources: Array<string>,
  affiliateUUIDs: Array<string>,
  operatorSpreads: Array<OperatorSpread>,
};

export type Props = {
  userType?: string,
  parentBranch?: string,
  withOperatorSpreads?: boolean,
  onCloseModal: () => void,
  onSuccess: () => void,
};

const CreateRuleModal = (props: Props) => {
  const {
    onCloseModal,
    onSuccess,
    parentBranch,
    withOperatorSpreads,
    userType,
  } = props;

  const [validationOnChangeEnabled, setValidationOnChangeEnabled] = useState<boolean>(false);

  const navigate = useNavigate();

  const { data: partnersQueryData } = usePartnersQuery();
  const partners = partnersQueryData?.partners?.content || [];

  const { data: operatorsSubordinatesData } = useOperatorsSubordinatesQuery({
    variables: { hierarchyTypeGroup: AcquisitionStatusTypes.SALES },
  });
  const operators = operatorsSubordinatesData?.operatorsSubordinates || [];

  const [createRuleMutation] = useCreateRuleMutation();

  const handleFindDuplicate = (createdByOrUuid: string) => {
    onCloseModal();
    navigate('/sales-rules', {
      state: {
        filters: { createdByOrUuid },
      },
    });
  };

  const handleSubmit = async (
    { operatorSpreads, ...values }: FormValues,
    { setSubmitting, setErrors }: FormikHelpers<FormValues>,
  ) => {
    const variables = decodeNullValues(values);

    if (withOperatorSpreads) {
      variables.operatorSpreads = [
        // the filter needs to delete an empty value in array
        ...operatorSpreads.filter(item => item && item.percentage),
      ];
    } else {
      variables.parentBranch = parentBranch;
    }

    try {
      await createRuleMutation({ variables });

      onSuccess();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_CREATED'),
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_NOT_CREATED'),
      });

      let _error = error.error;

      if (_error === 'error.entity.already.exist') {
        _error = (
          <>
            <Button
              type="button"
              data-testid="CreateRuleModal-errorButton"
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

    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        name: '',
        type: '',
        priority: '',
        countries: [],
        languages: [],
        sources: [],
        affiliateUUIDs: userType === 'PARTNER' ? [parentBranch] : [],
        ...withOperatorSpreads && {
          operatorSpreads: userType === 'OPERATOR' ? [{ parentUser: parentBranch, percentage: 100 }] : [],
        },
      } as FormValues}
      validate={(values) => {
        const errors = createValidator({
          name: ['required', 'string'],
          priority: ['required', `in:${priorities.join()}`],
          type: ['required', `in:${ruleTypes.map(({ value }) => value).join()}`],
          countries: `in:${Object.keys(countryList).join()}`,
          languages: `in:${Config.getAvailableLanguages().join()}`,
          'operatorSpreads.*.percentage': ['between:1,100', 'integer'],
          ...withOperatorSpreads && {
            'operatorSpreads.0.parentUser': 'required',
          },
        }, translateLabels(attributeLabels), false, customErrors)(values);

        return extraValidation(values, errors, { withOperatorSpreads });
      }}
      validateOnBlur={false}
      validateOnChange={validationOnChangeEnabled}
      onSubmit={handleSubmit}
    >
      {formikBag => (
        <Modal
          onCloseModal={onCloseModal}
          title={I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.HEADER')}
          disabled={!formikBag.dirty || formikBag.isSubmitting}
          clickSubmit={() => {
            setValidationOnChangeEnabled(true);
            formikBag.submitForm();
          }}
          buttonTitle={I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.CREATE_BUTTON')}
        >
          <Form>
            <div className="CreateRuleModal__body">
              <StaticTabs>
                <StaticTabsItem label={I18n.t('RULE_MODAL.SETTINGS_TAB_NAME')}>
                  <RuleSettings
                    operators={operators as Operator[]}
                    partners={partners as Partner[]}
                    operatorSpreads={formikBag.values.operatorSpreads}
                    formikBag={formikBag}
                  />
                </StaticTabsItem>

                <StaticTabsItem label={I18n.t('RULE_MODAL.SCHEDULE_TAB_NAME')}>
                  <CreateRuleSchedule />
                </StaticTabsItem>
              </StaticTabs>
            </div>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(CreateRuleModal);
