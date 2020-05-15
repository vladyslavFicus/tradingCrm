import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { graphql, compose, withApollo } from 'react-apollo';
import I18n from 'i18n-js';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { filterSetTypes } from 'constants/filterSet';
import { InputField, CheckBox } from 'components/ReduxForm';
import { createFilterSet, updateFilterSet } from 'graphql/mutations/filterSet';
import { filterSetByIdQuery } from 'graphql/queries/filterSet';
import { createValidator } from 'utils/validator';
import { actionTypes } from '../attributes';

class ActionFilterModal extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    error: PropTypes.any,
    notify: PropTypes.func.isRequired,
    createFilterSetMutation: PropTypes.func.isRequired,
    updateFilterSetMutation: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    action: PropTypes.string.isRequired,
    filterId: PropTypes.string,
    client: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
  };

  static defaultProps = {
    error: null,
    filterId: null,
  };

  handlePerformSubmitAction = async ({ name, favourite }) => {
    const {
      notify,
      action,
      fields,
      createFilterSetMutation,
      updateFilterSetMutation,
      onSuccess,
      onCloseModal,
      filterId: uuid,
    } = this.props;

    let error = null;
    let data = null;

    if (action === actionTypes.CREATE) {
      ({ data: { filterSet: { create: { error, data } } } } = await createFilterSetMutation({
        variables: {
          name,
          favourite: !!favourite,
          fields: JSON.stringify(fields),
          type: filterSetTypes.CLIENT,
        },
      }));
    } else {
      ({ data: { filterSet: { update: { error, success: data } } } } = await updateFilterSetMutation({
        variables: {
          name,
          uuid,
          fields: JSON.stringify(fields),
        },
      }));

      // Refetch concrete filter set by id to update it in apollo cache
      await this.props.client.query({
        query: filterSetByIdQuery,
        variables: { uuid },
        fetchPolicy: 'network-only',
      });
    }

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t(`FILTER_SET.${action}.FAILED`),
      });

      throw new SubmissionError({
        _error: error.fields_errors === 'filter.set.not.unique'
          ? I18n.t(`FILTER_SET.${action}.FAILED_EXIST`)
          : I18n.t(`FILTER_SET.${action}.FAILED_DESC`, { desc: error.error }),
      });
    }

    notify({
      level: 'success',
      title: I18n.t('COMMON.SUCCESS'),
      message: I18n.t(`FILTER_SET.${action}.SUCCESS`, { name }),
    });

    onSuccess(onCloseModal, data);
  }

  render() {
    const {
      handleSubmit,
      onCloseModal,
      isOpen,
      invalid,
      submitting,
      error,
      action,
    } = this.props;

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <ModalHeader toggle={onCloseModal}>
          <div>{I18n.t(`FILTER_SET.${action}_MODAL.HEADER`)}</div>
        </ModalHeader>
        <ModalBody
          tag="form"
          id="move-modal-form"
          onSubmit={handleSubmit(this.handlePerformSubmitAction)}
        >
          <If condition={error}>
            <div className="mb-2 text-center color-danger">
              {error}
            </div>
          </If>
          <Field
            name="name"
            type="text"
            label={I18n.t(`FILTER_SET.${action}_MODAL.FIELDS.FILTER_NAME`)}
            component={InputField}
          />
          <If condition={action === actionTypes.CREATE}>
            { /* TODO backend integration */ }
            <div className="row">
              <div className="form-group col-md-6">
                <Field
                  className="d-inline-block"
                  name="favourite"
                  component={CheckBox}
                  type="checkbox"
                  label={I18n.t(`FILTER_SET.${action}_MODAL.FIELDS.FAVOURITE`)}
                />
              </div>
            </div>
          </If>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-default-outline"
            onClick={onCloseModal}
          >
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </button>
          <button
            type="submit"
            disabled={invalid || submitting}
            className="btn btn-primary"
            form="move-modal-form"
          >
            {I18n.t('COMMON.SUBMIT')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

const FORM_NAME = 'actionFilterSetForm';

export default compose(
  withNotifications,
  withApollo,
  reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    validate: values => createValidator(
      { name: ['string', 'required'] },
      {},
      false,
    )(values),
  }),
  graphql(createFilterSet, {
    name: 'createFilterSetMutation',
  }),
  graphql(updateFilterSet, {
    name: 'updateFilterSetMutation',
  }),
)(ActionFilterModal);
