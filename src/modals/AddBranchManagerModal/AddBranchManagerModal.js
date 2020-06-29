import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests, parseErrors } from 'apollo';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import { FormikSelectField } from 'components/Formik';
import { createValidator, translateLabels } from 'utils/validator';
import getBranchHierarchyTreeQuery from './graphql/getBranchHierarchyTreeQuery';
import addBranchManagerMutation from './graphql/addBranchManagerMutation';
import './AddBranchManagerModal.scss';

const attributeLabels = {
  operatorUuid: 'COMMON.OPERATOR',
};

class AddBranchManagerModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    notify: PropTypes.func.isRequired,
    addBranchManager: PropTypes.func.isRequired,
    branchHierarchyTree: PropTypes.object.isRequired,
    branch: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      branchType: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  };

  handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(false);

    const {
      notify,
      onSuccess,
      onCloseModal,
      addBranchManager,
      branchHierarchyTree,
      branch: {
        uuid: branchUuid,
        name: branchName,
        branchType,
      },
    } = this.props;

    try {
      await addBranchManager({ variables: { branchUuid, ...values } });

      const { operatorUuid } = values;
      const operators = get(branchHierarchyTree, 'data.hierarchy.branchHierarchyTree.data.users') || [];

      const selectedOperator = operators.filter(({ uuid }) => uuid === operatorUuid)[0];
      const operatorName = selectedOperator.operator.fullName;

      notify({
        level: 'success',
        title: I18n.t('MODALS.ADD_BRANCH_MANAGER_MODAL.NOTIFICATION.SUCCEED.TITLE'),
        message: I18n.t(
          'MODALS.ADD_BRANCH_MANAGER_MODAL.NOTIFICATION.SUCCEED.DESC',
          { operatorName, branchType: I18n.t(`COMMON.${branchType}`), branchName },
        ),
      });

      onCloseModal();
      onSuccess();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('MODALS.ADD_BRANCH_MANAGER_MODAL.NOTIFICATION.FAILED.TITLE'),
        message: error.error === 'error.branch.manager.addition'
          ? I18n.t('MODALS.ADD_BRANCH_MANAGER_MODAL.NOTIFICATION.FAILED.ADDITION_FAILED')
          : I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  render() {
    const {
      isOpen,
      onCloseModal,
      title,
      description,
      branchHierarchyTree,
    } = this.props;

    const operators = get(branchHierarchyTree, 'data.hierarchy.branchHierarchyTree.data.users') || [];

    return (
      <Modal
        isOpen={isOpen}
        toggle={onCloseModal}
      >
        <Formik
          initialValues={{ operatorUuid: '' }}
          validate={createValidator({
            operatorUuid: ['required', 'string'],
          }, translateLabels(attributeLabels), false)}
          onSubmit={this.handleSubmit}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>{title}</ModalHeader>
              <ModalBody>
                <If condition={description}>
                  <div className="AddBranchManagerModal__description">
                    {description}
                  </div>
                </If>

                <If condition={operators.length === 0}>
                  <div className="AddBranchManagerModal__warning">
                    {I18n.t('MODALS.ADD_BRANCH_MANAGER_MODAL.NO_OPERATORS_WARNING')}
                  </div>
                </If>

                <Field
                  name="operatorUuid"
                  className="AddBranchManagerModal__select"
                  label={I18n.t('COMMON.CHOOSE_OPERATOR')}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSelectField}
                  disabled={isSubmitting || operators.length === 0}
                  searchable
                >
                  {operators.map(({ uuid, operator: { fullName, operatorStatus } }) => (
                    <option key={uuid} value={uuid} disabled={operatorStatus !== 'ACTIVE'}>
                      {fullName}
                    </option>
                  ))}
                </Field>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={onCloseModal}
                  commonOutline
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  primary
                >
                  {I18n.t('COMMON.BUTTONS.CONFIRM')}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default compose(
  withNotifications,
  withRouter,
  withRequests({
    branchHierarchyTree: getBranchHierarchyTreeQuery,
    addBranchManager: addBranchManagerMutation,
  }),
)(AddBranchManagerModal);
