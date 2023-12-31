import React from 'react';
import I18n from 'i18n-js';
import { Field, Form, Formik } from 'formik';
import { useParams } from 'react-router-dom';
import { Config, Utils, usePermission, notify, Types } from '@crm/common';
import { Button, FormikSingleSelectField, FormikMultipleSelectField, FormikInputField } from 'components';
import { useOperatorProfileQuery } from './graphql/__generated__/OperatorProfileQuery';
import { useOperatorAccessDataQuery } from './graphql/__generated__/OperatorAccessDataQuery';
import { useUpdateOperatorAndChangeRoleMutation } from './graphql/__generated__/UpdateOperatorAndChangeRoleMutation';
import './DealingOperatorProfileTab.scss';

const attributeLabels = {
  firstName: 'TRADING_ENGINE.OPERATOR_PROFILE.PERSONAL_FORM.FIRST_NAME',
  lastName: 'TRADING_ENGINE.OPERATOR_PROFILE.PERSONAL_FORM.LAST_NAME',
  phone: 'TRADING_ENGINE.OPERATOR_PROFILE.PERSONAL_FORM.PHONE',
  role: 'TRADING_ENGINE.OPERATOR_PROFILE.PERSONAL_FORM.ROLE',
  groups: 'TRADING_ENGINE.OPERATOR_PROFILE.PERSONAL_FORM.GROUPS',
  email: 'COMMON.EMAIL',
};

type FormValues = {
  firstName: string,
  lastName: string,
  phone: string,
  groupNames: string[],
  role: string,
  email: string,
};

const validate = Utils.createValidator({
  firstName: ['required', 'string'],
  lastName: ['required', 'string'],
  email: ['required', 'email'],
  country: [`in:,${Object.keys(Utils.countryList).join()}`],
  phone: 'string',
}, Utils.translateLabels(attributeLabels), false);

const DealingOperatorProfileTab = () => {
  const uuid = useParams().id as string;
  const permission = usePermission();

  const isReadOnly = permission.denies(Config.permissions.WE_TRADING.OPERATORS_UPDATE_OPERATOR);

  const operatorQuery = useOperatorProfileQuery({ variables: { uuid } });
  const operatorAccessDataQuery = useOperatorAccessDataQuery();
  const [updateOperatorAndChangeRoleMutation] = useUpdateOperatorAndChangeRoleMutation();

  const operator = operatorQuery.data?.tradingEngine.operator;
  const writeableRoles = operatorAccessDataQuery.data?.tradingEngine.operatorAccessData.writeableRoles || [];
  const groupNames = operatorAccessDataQuery.data?.tradingEngine.operatorAccessData.accessibleGroupNames || [];

  const handleUpdateOperator = async (values: FormValues) => {
    try {
      await updateOperatorAndChangeRoleMutation({
        variables: {
          uuid,
          args: {
            firstName: values.firstName,
            lastName: values.lastName,
            groupNames: values.groupNames,
            phone: values.phone,
            role: values.role,
          },
        },
      });

      Utils.EventEmitter.emit(Utils.OPERATOR_RELOAD);

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.NOTIFICATIONS.UPDATE_SUCCESS'),
      });
    } catch (e) {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.NOTIFICATIONS.UPDATE_ERROR'),
      });
    }
  };

  return (
    <div className="DealingOperatorProfileTab">
      <Formik
        initialValues={{
          phone: operator?.phone || '',
          firstName: operator?.firstName || '',
          lastName: operator?.lastName || '',
          email: operator?.email || '',
          role: operator?.role || 'AGENT',
          groupNames: operator?.groupNames || [],
        }}
        validate={validate}
        onSubmit={values => handleUpdateOperator(values)}
        enableReinitialize
      >
        {({ isSubmitting, dirty, values }) => (
          <Form className="DealingOperatorProfileForm">
            <div className="DealingOperatorProfileForm__header">
              <div className="DealingOperatorProfileForm__title">
                {I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.DETAILS.PERSONAL_INFORMATION')}
              </div>
              <div className="DealingOperatorProfileForm__actions">
                <If condition={dirty && !isSubmitting && !isReadOnly}>
                  <Button
                    small
                    primary
                    type="submit"
                    className="DealingOperatorProfileForm__action"
                    data-testid="DealingOperatorProfileTab-saveChangesButton"
                  >
                    {I18n.t('COMMON.SAVE_CHANGES')}
                  </Button>
                </If>
              </div>
            </div>

            <div className="DealingOperatorProfileForm__fields">
              <Field
                name="firstName"
                className="DealingOperatorProfileForm__field"
                data-testid="DealingOperatorProfileTab-firstNameInput"
                label={I18n.t(attributeLabels.firstName)}
                placeholder={I18n.t(attributeLabels.firstName)}
                component={FormikInputField}
                disabled={isSubmitting || isReadOnly}
              />

              <Field
                name="lastName"
                className="DealingOperatorProfileForm__field"
                data-testid="DealingOperatorProfileTab-lastNameInput"
                label={I18n.t(attributeLabels.lastName)}
                placeholder={I18n.t(attributeLabels.lastName)}
                component={FormikInputField}
                disabled={isSubmitting || isReadOnly}
              />

              <Field
                name="email"
                className="DealingOperatorProfileForm__field"
                data-testid="DealingOperatorProfileTab-emailInput"
                label={I18n.t(attributeLabels.email)}
                placeholder={I18n.t(attributeLabels.email)}
                component={FormikInputField}
                disabled
              />
            </div>

            <hr />

            <div className="DealingOperatorProfileForm__title">
              {I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.DETAILS.CONTACTS')}
            </div>

            <div className="DealingOperatorProfileForm__fields">
              <Field
                name="phone"
                className="DealingOperatorProfileForm__field"
                data-testid="DealingOperatorProfileTab-phoneInput"
                label={I18n.t(attributeLabels.phone)}
                placeholder={I18n.t(attributeLabels.phone)}
                component={FormikInputField}
                disabled={isSubmitting || isReadOnly}
              />

              <Field
                name="role"
                className="DealingOperatorProfileForm__field"
                data-testid="DealingOperatorProfileTab-roleSelect"
                label={I18n.t(attributeLabels.role)}
                component={FormikSingleSelectField}
                disabled={isSubmitting || isReadOnly}
                options={writeableRoles.map(role => ({
                  label: role,
                  value: role,
                }))}
              />
            </div>
            <div className="DealingOperatorProfileForm__fields">
              <Field
                searchable
                multipleLabel
                name="groupNames"
                className="DealingOperatorProfileForm__field"
                data-testid="DealingOperatorProfileTab-groupNamesSelect"
                label={I18n.t(attributeLabels.groups)}
                component={FormikMultipleSelectField}
                disabled={isSubmitting || isReadOnly}
                options={groupNames.map(group => ({
                  label: group,
                  value: group,
                }))}
              />
            </div>
            <If condition={!values.groupNames?.length}>
              <div className="DealingOperatorProfileForm__note">
                <b>{I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.NOTE')}</b>
                {': '}
                {I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.NOTE_MESSAGE')}
              </div>
            </If>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default React.memo(DealingOperatorProfileTab);
