import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { compose, withApollo } from 'react-apollo';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import I18n from 'i18n-js';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import { FormikInputField, FormikCheckbox } from 'components/Formik';
import { createValidator } from 'utils/validator';
import filterSetByIdQuery from './graphql/filterSetByIdQuery';
import createFilterSetMutation from './graphql/createFilterSetMutation';
import updateFilterSetMutation from './graphql/updateFilterSetMutation';
import { actionTypes } from './attributes';

const attributeLabels = {
  name: I18n.t('FILTER_SET.CREATE_MODAL.FIELDS.FILTER_NAME'),
};

const validate = createValidator({
  name: ['required', 'string'],
}, attributeLabels, false);

class ActionFilterModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    createFilterSet: PropTypes.func.isRequired,
    updateFilterSet: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    formError: PropTypes.string,
    notify: PropTypes.func.isRequired,
    action: PropTypes.string.isRequired,
    filterId: PropTypes.string,
    fields: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    filterSetType: PropTypes.string.isRequired,
    name: PropTypes.string,
  };

  static defaultProps = {
    name: '',
    formError: '',
    filterId: null,
  };

  async handleCreate(name, favourite, setErrors) {
    const {
      notify,
      fields,
      createFilterSet,
      onSuccess,
      onCloseModal,
      filterSetType,
    } = this.props;

    try {
      const { data: { filterSet: { create: filter } } } = await createFilterSet({
        variables: {
          name,
          favourite: !!favourite,
          fields: JSON.stringify(fields),
          type: filterSetType,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('FILTER_SET.CREATE.SUCCESS', { name }),
      });

      onSuccess(onCloseModal, filter);
    } catch (e) {
      const error = get(e, 'graphQLErrors.0.extensions.response.body');

      setErrors({
        submit: error === 'filter.set.not.unique'
          ? I18n.t('FILTER_SET.CREATE.FAILED_EXIST')
          : I18n.t('FILTER_SET.CREATE.FAILED_DESC', { desc: error }),
      });

      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('FILTER_SET.CREATE.FAILED'),
      });
    }
  }

  async handleUpdate(name) {
    const {
      notify,
      fields,
      updateFilterSet,
      onSuccess,
      onCloseModal,
      filterId: uuid,
    } = this.props;

    try {
      await updateFilterSet({
        variables: {
          name,
          uuid,
          fields: JSON.stringify(fields),
        },
      });

      // Refetch concrete filter set by id to update it in apollo cache
      await this.props.client.query({
        query: filterSetByIdQuery,
        variables: { uuid },
        fetchPolicy: 'network-only',
      });

      onSuccess(onCloseModal, { uuid });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('FILTER_SET.UPDATE.SUCCESS', { name }),
      });
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('FILTER_SET.UPDATE.FAILED'),
      });
    }
  }

  handlePerformSubmitAction = async ({ name, favourite }, { setErrors }) => {
    const { action } = this.props;

    if (action === actionTypes.CREATE) {
      await this.handleCreate(name, favourite, setErrors);
    }

    if (action === actionTypes.UPDATE) {
      await this.handleUpdate(name);
    }
  }

  render() {
    const {
      name,
      onCloseModal,
      isOpen,
      action,
      formError,
    } = this.props;

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <Formik
          initialValues={{ name }}
          validate={validate}
          onSubmit={this.handlePerformSubmitAction}
        >
          {({ errors, isValid, dirty, isSubmitting }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                <div>{I18n.t(`FILTER_SET.${action}_MODAL.HEADER`)}</div>
              </ModalHeader>
              <ModalBody>
                <If condition={formError || errors.submit}>
                  <div className="mb-2 text-center color-danger">
                    {formError || errors.submit}
                  </div>
                </If>
                <Field
                  name="name"
                  type="text"
                  label={I18n.t(`FILTER_SET.${action}_MODAL.FIELDS.FILTER_NAME`)}
                  placeholder={I18n.t(`FILTER_SET.${action}_MODAL.FIELDS.FILTER_NAME`)}
                  component={FormikInputField}
                />
                <If condition={action === actionTypes.CREATE}>
                  { /* TODO backend integration */ }
                  <div className="row">
                    <div className="form-group col-md-6">
                      <Field
                        className="d-inline-block"
                        name="favourite"
                        component={FormikCheckbox}
                        label={I18n.t(`FILTER_SET.${action}_MODAL.FIELDS.FAVOURITE`)}
                      />
                    </div>
                  </div>
                </If>
              </ModalBody>
              <ModalFooter>
                <Button
                  commonOutline
                  onClick={onCloseModal}
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  primary
                  type="submit"
                  disabled={!isValid || (!name && !dirty) || isSubmitting}
                >
                  {I18n.t('COMMON.SUBMIT')}
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
  withApollo,
  withNotifications,
  withRequests({
    createFilterSet: createFilterSetMutation,
    updateFilterSet: updateFilterSetMutation,
  }),
)(ActionFilterModal);