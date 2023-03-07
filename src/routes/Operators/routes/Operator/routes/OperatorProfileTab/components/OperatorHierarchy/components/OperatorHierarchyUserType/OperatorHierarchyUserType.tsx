import React from 'react';
import I18n from 'i18n-js';
import { omit } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { parseErrors } from 'apollo';
import { Operator } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { userTypes, userTypeLabels } from 'constants/hierarchyTypes';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { useUpdateOperatorUserTypeMutation } from './graphql/__generated__/UpdateOperatorUserTypeMutation';
import './OperatorHierarhyUsetType.scss';

type FormValues = {
  userType: string,
};

type Props = {
  operator: Operator,
  allowToUpdateHierarchy: boolean,
  onRefetch: () => void,
};

const OperatorHierarchyUserType = (props: Props) => {
  const { operator, allowToUpdateHierarchy, onRefetch } = props;

  const userTypesOptions = Object.keys(omit(userTypes, ['CUSTOMER', 'LEAD_CUSTOMER', 'AFFILIATE_PARTNER']));

  // ===== Requests ===== //
  const [updateOperatorUserTypeMutation] = useUpdateOperatorUserTypeMutation();

  // ===== Handlers ===== //
  const handleSubmit = async ({ userType }: FormValues) => {
    try {
      await updateOperatorUserTypeMutation({
        variables: {
          operatorId: operator.uuid,
          userType,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('OPERATORS.PROFILE.HIERARCHY.SUCCESS_UPDATE_TYPE'),
      });

      onRefetch();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: error.message || I18n.t('OPERATORS.PROFILE.HIERARCHY.ERROR_UPDATE_TYPE'),
      });
    }
  };

  return (
    <Formik
      initialValues={{ userType: operator.userType || '' }}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, dirty }) => (
        <Form className="OperatorHierarchyUserType">
          <Field
            name="userType"
            className="OperatorHierarchyUserType__field"
            label={I18n.t('OPERATORS.PROFILE.HIERARCHY.FORM_LABEL.USER_TYPE')}
            component={FormikSelectField}
            disabled={isSubmitting || !allowToUpdateHierarchy}
            searchable
          >
            {userTypesOptions.map(userTypeOption => (
              <option key={userTypeOption} value={userTypeOption}>
                {I18n.t(userTypeLabels[userTypeOption as userTypes])}
              </option>
            ))}
          </Field>

          <If condition={dirty && !isSubmitting && allowToUpdateHierarchy}>
            <div className="OperatorHierarchyUserType__buttons">
              <Button
                primary
                className="OperatorHierarchyUserType__button"
                type="submit"
              >
                {I18n.t('COMMON.SAVE')}
              </Button>
            </div>
          </If>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(OperatorHierarchyUserType);
