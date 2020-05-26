import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { Button } from 'components/UI';
import { FormikSelectField } from 'components/Formik';
import { attributeLabels } from './constants';

const validate = reasons => createValidator({
  reason: `required|string|in:${Object.keys(reasons).join()}`,
}, translateLabels(attributeLabels), false);

class AccountStatusModal extends PureComponent {
  static propTypes = {
    action: PropTypes.string,
    reasons: PropTypes.object.isRequired,
    title: PropTypes.string,
    status: PropTypes.string.isRequired,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  static defaultProps = {
    action: null,
    title: '',
  };

  onHandleSubmit = (values, { setSubmitting }) => {
    this.props.onSubmit({ ...values, status: this.props.status });

    setSubmitting(false);
  };

  render() {
    const {
      onHide,
      action,
      title,
      reasons,
    } = this.props;

    return (
      <Modal isOpen toggle={onHide}>
        <Formik
          initialValues={{ reason: '' }}
          validate={validate(reasons)}
          onSubmit={this.onHandleSubmit}
        >
          {({ dirty }) => (
            <Form>
              <If condition={title}>
                <ModalHeader toggle={onHide}>
                  {title}
                </ModalHeader>
              </If>
              <ModalBody>
                <Field
                  name="reason"
                  label={I18n.t(attributeLabels.reason)}
                  component={FormikSelectField}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.REASON')}
                >
                  {Object.keys(reasons).map(key => (
                    <option key={key} value={key}>
                      {I18n.t(renderLabel(key, reasons))}
                    </option>
                  ))}
                </Field>
              </ModalBody>

              <ModalFooter>
                <Button
                  className="mr-auto"
                  commonOutline
                  onClick={onHide}
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  danger
                  type="submit"
                  disabled={!dirty}
                >
                  {action}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default AccountStatusModal;
