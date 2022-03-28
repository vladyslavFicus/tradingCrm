import React from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { Field, Form, Formik } from 'formik';
import { useParams } from 'react-router-dom';
import { withNotifications } from 'hoc';
import { LevelType, Notify } from 'types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { createValidator, translateLabels } from 'utils/validator';
import countries from 'utils/countryList';
import EventEmitter, { OPERATOR_RELOAD } from 'utils/EventEmitter';
import Button from 'components/UI/Button';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { TradingEngine__OperatorRoles__Enum as OperatorRolesEnum } from '__generated__/types';
import { useOperatorProfileQuery } from './graphql/__generated__/OperatorProfileQuery';
import { useOperatorAccessDataQuery } from './graphql/__generated__/OperatorAccessDataQuery';
import { useUpdateOperatorAndChangeRoleMutation } from './graphql/__generated__/UpdateOperatorAndChangeRoleMutation';
import './DealingOperatorProfileTab.scss';

type Props = {
  notify: Notify,
}

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
  role: OperatorRolesEnum,
  email: string,
}

const validate = createValidator({
  firstName: ['required', 'string'],
  lastName: ['required', 'string'],
  email: ['required', 'email'],
  country: [`in:,${Object.keys(countries).join()}`],
  phone: 'string',
}, translateLabels(attributeLabels), false);

const DealingOperatorProfileTab = ({ notify }: Props) => {
  const { id: uuid } = useParams<{ id: string }>();
  const permission = usePermission();

  const isReadOnly = permission.denies(permissions.WE_TRADING.OPERATORS_UPDATE_OPERATOR);

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

      EventEmitter.emit(OPERATOR_RELOAD);

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.NOTIFICATIONS.UPDATE_SUCCESS'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
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
          role: operator?.role || OperatorRolesEnum.AGENT,
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
                label={I18n.t(attributeLabels.firstName)}
                placeholder={I18n.t(attributeLabels.firstName)}
                component={FormikInputField}
                disabled={isSubmitting || isReadOnly}
              />

              <Field
                name="lastName"
                className="DealingOperatorProfileForm__field"
                label={I18n.t(attributeLabels.lastName)}
                placeholder={I18n.t(attributeLabels.lastName)}
                component={FormikInputField}
                disabled={isSubmitting || isReadOnly}
              />

              <Field
                name="email"
                className="DealingOperatorProfileForm__field"
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
                label={I18n.t(attributeLabels.phone)}
                placeholder={I18n.t(attributeLabels.phone)}
                component={FormikInputField}
                disabled={isSubmitting || isReadOnly}
              />

              <Field
                name="role"
                className="DealingOperatorProfileForm__field"
                label={I18n.t(attributeLabels.role)}
                component={FormikSelectField}
                disabled={isSubmitting || isReadOnly}
              >
                {writeableRoles.map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Field>
            </div>
            <div className="DealingOperatorProfileForm__fields">
              <Field
                name="groupNames"
                className="DealingOperatorProfileForm__field"
                label={I18n.t(attributeLabels.groups)}
                component={FormikSelectField}
                searchable
                multiple
                multipleLabel
                disabled={isSubmitting || isReadOnly}
              >
                {groupNames.map(group => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </Field>
            </div>
            <If condition={values.groupNames.length === 0}>
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

export default compose(
  React.memo,
  withNotifications,
)(DealingOperatorProfileTab);
