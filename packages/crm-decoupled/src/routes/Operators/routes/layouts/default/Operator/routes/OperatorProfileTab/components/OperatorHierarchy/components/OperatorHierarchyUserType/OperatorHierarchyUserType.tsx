import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Constants } from '@crm/common';
import { Button, FormikSingleSelectField } from 'components';
import { Operator } from '__generated__/types';
import useOperatorHierarchyUserType from 'routes/Operators/routes/hooks/useOperatorHierarchyUserType';
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
            searchable
            name="userType"
            className="OperatorHierarchyUserType__field"
            data-testid="OperatorHierarchyUserType-userTypeSelect"
            label={I18n.t('OPERATORS.PROFILE.HIERARCHY.FORM_LABEL.USER_TYPE')}
            component={FormikSingleSelectField}
            disabled={isSubmitting || !allowToUpdateHierarchy}
            options={userTypesOptions.map(userTypeOption => ({
              label: I18n.t(Constants.userTypeLabels[userTypeOption as Constants.userTypes]),
              value: userTypeOption,
            }))}
          />

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
