import React from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/Buttons';
import countryList from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import { TypesRestrictedCountriesModal } from './constant';
import './RestrictedCountriesModal.scss';

const attributeLabels = {
  forbiddenCountries: 'MODALS.RESTRICTED_COUNTRIES.LABELS_FIELD',
};

type FormValues = {
  forbiddenCountries: Array<string>,
};

export type Props = {
  onSuccess: (value: FormValues) => void,
  onCloseModal?: () => void,
  type?: TypesRestrictedCountriesModal.ADD | TypesRestrictedCountriesModal.DELETE,
};

const RestrictedCountriesModal = (props: Props) => {
  const { onSuccess, onCloseModal, type = TypesRestrictedCountriesModal.ADD } = props;

  // ===== Handlers ===== //
  const handleSubmit = (values: FormValues) => {
    onSuccess(values);
    onCloseModal?.();
  };

  return (
    <Modal className="RestrictedCountriesModal" toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{ forbiddenCountries: [] } as FormValues}
        validate={createValidator(
          {
            forbiddenCountries: [`in:,${Object.keys(countryList).join()}`],
          },
          translateLabels(attributeLabels),
          false,
        )}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              <Choose>
                <When condition={type === TypesRestrictedCountriesModal.ADD}>
                  {I18n.t('MODALS.RESTRICTED_COUNTRIES.HEADER_ALLOW')}
                </When>

                <Otherwise>
                  {I18n.t('MODALS.RESTRICTED_COUNTRIES.HEADER_DISALLOW')}
                </Otherwise>
              </Choose>
            </ModalHeader>

            <ModalBody>
              <Field
                name="forbiddenCountries"
                className="RestrictedCountriesModal__field"
                data-testid="RestrictedCountriesModal-forbiddenCountriesSelect"
                label={I18n.t('PARTNERS.PROFILE.CONTACTS.FORM.LABELS.RESTRICTED_COUNTRIES')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.COUNTRY')}
                component={FormikSelectField}
                searchable
                multiple
                disabled={isSubmitting}
              >
                {Object.entries(countryList).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Field>
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={onCloseModal}
                className="RestrictedCountriesModal__button"
                data-testid="RestrictedCountriesModal-cancelButton"
                tertiary
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                className={classNames('RestrictedCountriesModal__button', {
                  'RestrictedCountriesModal__button--success': type === TypesRestrictedCountriesModal.DELETE,
                  'RestrictedCountriesModal__button--danger': type === TypesRestrictedCountriesModal.ADD,
                })}
                data-testid="RestrictedCountriesModal-actionButton"
                disabled={!values?.forbiddenCountries?.length}
                type="submit"
                tertiary
              >
                <Choose>
                  <When condition={type === TypesRestrictedCountriesModal.ADD}>
                    {I18n.t('MODALS.RESTRICTED_COUNTRIES.RESTRICT')}
                  </When>

                  <Otherwise>
                    {I18n.t('MODALS.RESTRICTED_COUNTRIES.ALLOW')}
                  </Otherwise>
                </Choose>
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(RestrictedCountriesModal);
