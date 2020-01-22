import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import countryList from 'utils/countryList';
import { createValidator } from 'utils/validator';
import { FormikInputField, FormikSelectField } from 'components/Formik';

const attributeLabels = {
  name: I18n.t('OFFICES.MODAL.LABELS.OFFICE_NAME'),
  country: I18n.t('OFFICES.MODAL.LABELS.COUNTRY'),
};

const validate = createValidator({
  name: ['required', 'string'],
  country: ['required', 'string'],
}, attributeLabels, false);

class AddOfficeModal extends PureComponent {
  static propTypes = {
    error: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
  }

  static defaultProps = {
    error: null,
  }

  onHandleSubmit = (values, { setSubmitting }) => {
    this.props.onSubmit(values);
    setSubmitting(false);
  };

  render() {
    const {
      error,
      isOpen,
      onCloseModal,
    } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        toggle={onCloseModal}
      >
        <Formik
          initialValues={{ name: '', country: '' }}
          validate={validate}
          onSubmit={this.onHandleSubmit}
        >
          {({ isValid, isSubmitting }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('OFFICES.MODAL.HEADER')}
              </ModalHeader>
              <ModalBody>
                <If condition={error}>
                  <div className="mb-2 text-center color-danger">
                    {error}
                  </div>
                </If>
                <Field
                  name="name"
                  label={attributeLabels.name}
                  placeholder={I18n.t('COMMON.NAME')}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
                <Field
                  name="country"
                  label={attributeLabels.country}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSelectField}
                  disabled={isSubmitting}
                  searchable
                >
                  {Object.keys(countryList).map(country => (
                    <option key={country} value={country}>
                      {countryList[country]}
                    </option>
                  ))}
                </Field>
              </ModalBody>
              <ModalFooter>
                <button
                  className="btn btn-default-outline"
                  onClick={onCloseModal}
                  type="button"
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </button>
                <button
                  className="btn btn-primary"
                  disabled={!isValid || isSubmitting}
                  type="submit"
                >
                  {I18n.t('OFFICES.MODAL.CREATE_BUTTON')}
                </button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default AddOfficeModal;
