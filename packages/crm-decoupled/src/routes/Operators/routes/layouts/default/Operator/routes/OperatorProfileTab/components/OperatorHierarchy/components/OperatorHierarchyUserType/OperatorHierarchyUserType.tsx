import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Operator } from '__generated__/types';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components';
import useOperatorHierarchyUserType from 'routes/Operators/routes/hooks/useOperatorHierarchyUserType';
import { userTypes, userTypeLabels } from 'constants/hierarchyTypes';
import './OperatorHierarhyUsetType.scss';

type Props = {
  operator: Operator,
  allowToUpdateHierarchy: boolean,
  onRefetch: () => void,
};

const OperatorHierarchyUserType = (props: Props) => {
  const { operator, allowToUpdateHierarchy, onRefetch } = props;

  const {
    userTypesOptions,
    handleSubmit,
  } = useOperatorHierarchyUserType({
    operator,
    onRefetch,
  });

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
            data-testid="OperatorHierarchyUserType-userTypeSelect"
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
                data-testid="OperatorHierarchyUserType-saveButton"
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
