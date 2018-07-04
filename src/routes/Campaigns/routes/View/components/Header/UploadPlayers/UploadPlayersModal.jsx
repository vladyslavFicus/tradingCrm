import React, { Component } from 'react';
import fileSize from 'filesize';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { withReduxFormValues } from '../../../../../../../components/HighOrder';
import { SelectField } from '../../../../../../../components/ReduxForm';
import FileUpload from '../../../../../../../components/FileUpload';
import { createValidator, translateLabels } from '../../../../../../../utils/validator';
import renderLabel from '../../../../../../../utils/renderLabel';
import { attributeLabels, typesLabels, typesActionDescription } from './constants';
import { shortifyInMiddle } from '../../../../../../../utils/stringFormat';

class UploadPlayersModal extends Component {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    invalid: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    formValues: PropTypes.shape({
      type: PropTypes.string,
    }),
    types: PropTypes.arrayOf(PropTypes.string),
  };
  static defaultProps = {
    handleSubmit: null,
    formValues: {},
    types: [],
  };

  state = {
    file: null,
    errors: [],
  };

  handleUploadFile = (errors, file) => {
    this.setState({
      file,
      errors,
    });
  };

  handleSubmit = (data) => {
    const { onSubmit } = this.props;
    const { file } = this.state;

    onSubmit({ ...data, file });
  };

  renderTypes = () => {
    const { types } = this.props;

    return (
      <Field
        name="type"
        label={I18n.t(attributeLabels.type)}
        component={SelectField}
      >
        <option value="">{I18n.t('COMMON.SELECT_OPTION.UPLOAD_TYPE')}</option>
        {types.map(type => (
          <option key={type} value={type}>
            {renderLabel(type, typesLabels)}
          </option>
        ))}
      </Field>
    );
  };

  render() {
    const {
      onCloseModal,
      handleSubmit,
      isOpen,
      invalid,
      formValues,
    } = this.props;
    const { file, errors } = this.state;

    const type = get(formValues, 'type');

    return (
      <Modal isOpen={isOpen} toggle={onCloseModal}>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <ModalHeader toggle={onCloseModal}>
            {I18n.t(attributeLabels.title)}
          </ModalHeader>
          <ModalBody>
            <If condition={type}>
              <div className="text-center my-4">
                <span className="font-weight-700">
                  {renderLabel(type, typesLabels)}
                </span>
                {' - '}
                {I18n.t(typesActionDescription[type])}
              </div>
            </If>
            <div className="row">
              <div className="col-md-6">
                {this.renderTypes()}
              </div>
              <div className="col-md-3">
                <FileUpload
                  className="margin-top-20"
                  label={I18n.t('FILES.UPLOAD_MODAL.BUTTONS.ADD_FILES')}
                  allowedTypes={['text/csv', 'application/vnd.ms-excel']}
                  onChosen={this.handleUploadFile}
                />
                <If condition={file}>
                  {shortifyInMiddle(file.name, 16)}
                </If>
              </div>
              <If condition={file}>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Upload status</label>
                    <div className="margin-top-10">
                      <Choose>
                        <When condition={errors.length}>
                          <For each="error" index="index" of={errors}>
                            <div className="color-danger" key={index}>
                              {error}
                            </div>
                          </For>
                        </When>
                        <Otherwise>
                          <span className="color-success">
                            {I18n.t('COMMON.SUCCESS')} ({fileSize(file.size)})
                          </span>
                        </Otherwise>
                      </Choose>
                    </div>
                  </div>
                </div>
              </If>
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              className="btn btn-default-outline mr-auto"
              onClick={onCloseModal}
            >
              {I18n.t('CAMPAIGNS.CHANGE_STATUS_MODAL.CANCEL_BUTTON')}
            </button>
            <button
              disabled={invalid || !file || errors.length}
              className="btn btn-danger"
              type="submit"
            >
              {I18n.t('COMMON.UPLOAD')}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default compose(
  reduxForm({
    form: 'uploadPlayersModal',
    validate: createValidator({
      type: ['required', 'string'],
    }, translateLabels(attributeLabels), false),
    enableReinitialize: true,
  }),
  withReduxFormValues,
)(UploadPlayersModal);
