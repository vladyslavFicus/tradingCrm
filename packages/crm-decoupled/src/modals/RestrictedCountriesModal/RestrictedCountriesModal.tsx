import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Utils } from '@crm/common';
import { FormikSelectField } from 'components/Formik';
import Modal from 'components/Modal';

import { TypesRestrictedCountriesModal, attributeLabels } from './constant';

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
    <Formik
      initialValues={{ forbiddenCountries: [] } as FormValues}
      validate={Utils.createValidator(
        {
          forbiddenCountries: [`in:,${Object.keys(Utils.countryList).join()}`],
        },
        Utils.translateLabels(attributeLabels),
        false,
      )}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting, submitForm }) => (
        <Modal
          onCloseModal={() => onCloseModal?.()}
          title={type === TypesRestrictedCountriesModal.ADD
            ? I18n.t('MODALS.RESTRICTED_COUNTRIES.HEADER_ALLOW')
            : I18n.t('MODALS.RESTRICTED_COUNTRIES.HEADER_DISALLOW')}
          buttonTitle={type === TypesRestrictedCountriesModal.ADD
            ? I18n.t('MODALS.RESTRICTED_COUNTRIES.RESTRICT')
            : I18n.t('MODALS.RESTRICTED_COUNTRIES.ALLOW')}
          disabled={!values?.forbiddenCountries?.length}
          styleButton={type === TypesRestrictedCountriesModal.ADD ? 'danger' : 'success'}
          clickSubmit={submitForm}
        >
          <Form>
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
              {Object.entries(Utils.countryList).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Field>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(RestrictedCountriesModal);
