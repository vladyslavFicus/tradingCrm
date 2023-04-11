import React from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikProps, FormikHelpers } from 'formik';
import { ClientSearch__Input as ClientSearch } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Button } from 'components/Buttons';
import { FormikInputField, FormikCheckbox } from 'components/Formik';
import { createValidator } from 'utils/validator';
import { actionTypes } from './attributes';
import { useCreateFilterSetMutation } from './graphql/__generated__/CreateFilterSetMutation';
import { useUpdateFilterSetMutation } from './graphql/__generated__/UpdateFilterSetMutation';
import { useFilterSetByIdQueryLazyQuery } from './graphql/__generated__/FilterSetByIdQuery';
import './ActionFilterModal.scss';

const attributeLabels = {
  name: I18n.t('FILTER_SET.CREATE_MODAL.FIELDS.FILTER_NAME'),
};

const validate = createValidator({
  name: ['required', 'string'],
}, attributeLabels, false);

type FormValues = {
  name?: string,
  favourite?: boolean,
  submit?: () => void,
};

export type Props = {
  action: string,
  fields: ClientSearch,
  filterSetType: string,
  filterId?: string,
  formError?: string,
  name?: string,
  onCloseModal: () => void,
  onSuccess: Function,
};

const ActionFilterModal = (props: Props) => {
  const {
    formError = '',
    name: filterName = '',
    fields,
    action,
    filterSetType,
    filterId,
    onSuccess,
    onCloseModal,
  } = props;

  const [createFilterSet] = useCreateFilterSetMutation();
  const [updateFilterSet] = useUpdateFilterSetMutation();
  const [getFilterSetByIdQuery] = useFilterSetByIdQueryLazyQuery();

  const handleCreate = async (
    { name: chooseName, favourite }: FormValues, formikHelpers: FormikHelpers<FormValues>,
  ) => {
    try {
      const { data } = await createFilterSet({
        variables: {
          name: chooseName || '',
          favourite: !!favourite,
          fields: JSON.stringify(fields),
          type: filterSetType,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('FILTER_SET.CREATE.SUCCESS', { name: chooseName }),
      });

      onSuccess(onCloseModal, data?.filterSet.create);
    } catch (e) {
      const error = get(e, 'graphQLErrors.0.extensions.response.body');

      formikHelpers.setErrors({
        submit: error === 'filter.set.not.unique'
          ? I18n.t('FILTER_SET.CREATE.FAILED_EXIST')
          : I18n.t('FILTER_SET.CREATE.FAILED_UNIQUE'),
      });

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('FILTER_SET.CREATE.FAILED'),
      });
    }
  };

  const handleUpdate = async (name: string) => {
    try {
      await updateFilterSet({
        variables: {
          name,
          uuid: filterId || '',
          fields: JSON.stringify(fields),
        },
      });

      await getFilterSetByIdQuery({
        variables: { uuid: filterId || '' },
      });

      onSuccess(onCloseModal, { uuid: filterId });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('FILTER_SET.UPDATE.SUCCESS', { name }),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('FILTER_SET.UPDATE.FAILED'),
      });
    }
  };

  const handlePerformSubmitAction = async (
    { name, favourite }: FormValues, formikHelpers: FormikHelpers<FormValues>,
  ) => {
    if (action === actionTypes.CREATE) {
      await handleCreate({ name, favourite }, formikHelpers);
    } else if (action === actionTypes.UPDATE) {
      await handleUpdate(name as string);
    }
  };

  return (
    <Modal
      toggle={onCloseModal}
      isOpen
    >
      <Formik
        initialValues={{
          name: filterName,
          favourite: false,
        } as FormValues}
        validate={validate}
        onSubmit={handlePerformSubmitAction}
      >
        {({ errors, isValid, dirty, isSubmitting }: FormikProps<FormValues>) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              <div>{I18n.t(`FILTER_SET.${action}_MODAL.HEADER`)}</div>
            </ModalHeader>

            <ModalBody>
              <If condition={!!formError || !!errors.submit}>
                <div className="ActionFilterModal__error">
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
                <Field
                  name="favourite"
                  component={FormikCheckbox}
                  label={I18n.t(`FILTER_SET.${action}_MODAL.FIELDS.FAVOURITE`)}
                />
              </If>
            </ModalBody>

            <ModalFooter>
              <Button
                tertiary
                onClick={onCloseModal}
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                primary
                type="submit"
                disabled={!isValid || (!filterName && !dirty) || isSubmitting}
              >
                {I18n.t('COMMON.SUBMIT')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(ActionFilterModal);
