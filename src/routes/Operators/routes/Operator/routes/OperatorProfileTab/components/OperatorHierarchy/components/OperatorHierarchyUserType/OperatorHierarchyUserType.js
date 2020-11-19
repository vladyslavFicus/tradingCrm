import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { omit } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { parseErrors, withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { userTypes, userTypeLabels } from 'constants/hierarchyTypes';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import UpdateOperatorUserTypeMutation from './graphql/UpdateOperatorUserTypeMutation';
import './OperatorHierarhyUsetType.scss';

class OperatorHierarchyUserType extends PureComponent {
  static propTypes = {
    notify: PropTypes.func.isRequired,
    allowToUpdateHierarchy: PropTypes.bool.isRequired,
    updateOperatorUserType: PropTypes.func.isRequired,
    operatorQuery: PropTypes.query({
      operator: PropTypes.operator,
    }).isRequired,
  }

  handleUpdateUsetType = async ({ userType }, { setSubmitting }) => {
    const {
      notify,
      operatorQuery,
      updateOperatorUserType,
    } = this.props;

    const operatorUuid = operatorQuery.data?.operator?.uuid;

    try {
      await updateOperatorUserType({
        variables: {
          operatorId: operatorUuid,
          userType,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('OPERATORS.PROFILE.HIERARCHY.SUCCESS_UPDATE_TYPE'),
      });

      await operatorQuery.refetch();

      setSubmitting(false);
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: error.message || I18n.t('OPERATORS.PROFILE.HIERARCHY.ERROR_UPDATE_TYPE'),
      });
    }
  }

  render() {
    const {
      operatorQuery,
      allowToUpdateHierarchy,
    } = this.props;

    const operatorUserType = operatorQuery.data?.operator?.hierarchy?.userType;

    const userTypesOptions = Object.keys(omit(userTypes, ['CUSTOMER', 'LEAD_CUSTOMER', 'AFFILIATE_PARTNER']));

    return (
      <Formik
        initialValues={{ userType: operatorUserType }}
        onSubmit={this.handleUpdateUsetType}
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
                  {I18n.t(userTypeLabels[userTypeOption])}
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
  }
}

export default compose(
  withNotifications,
  withRequests({
    updateOperatorUserType: UpdateOperatorUserTypeMutation,
  }),
)(OperatorHierarchyUserType);
