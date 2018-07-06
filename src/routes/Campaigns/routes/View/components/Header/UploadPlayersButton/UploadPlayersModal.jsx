import React, { Component } from 'react';
import fileSize from 'filesize';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { SelectField } from '../../../../../../../components/ReduxForm';
import FileUpload from '../../../../../../../components/FileUpload';
import renderLabel from '../../../../../../../utils/renderLabel';
import {
  attributeLabels,
  actionsLabels,
  actionDescription,
  actions as uploadActions,
} from './constants';
import { shortifyInMiddle } from '../../../../../../../utils/stringFormat';

const initialState = {
  file: null,
  errors: [],
};

class UploadPlayersModal extends Component {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    invalid: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    formValues: PropTypes.shape({
      action: PropTypes.string,
    }),
    actions: PropTypes.arrayOf(PropTypes.string),
    reset: PropTypes.func.isRequired,
  };
  static defaultProps = {
    handleSubmit: null,
    formValues: {},
    actions: [],
  };

  state = { ...initialState };

  handleUploadFile = (errors, file) => {
    this.setState({
      file,
      errors,
    });
  };

  resetForm = () => {
    const { reset } = this.props;

    this.setState({ ...initialState });
    reset();
  };

  handleClose = () => {
    const { onCloseModal } = this.props;

    this.resetForm();
    onCloseModal();
  };

  handleSubmit = async ({ action }) => {
    const {
      uploadPlayersFile,
      uploadResetPlayersFile,
      uploadSoftResetPlayersFile,
      campaignUuid,
      onCloseModal,
      notify,
    } = this.props;
    const { file } = this.state;

    let response = {};

    switch (action) {
      case uploadActions.UPLOAD_PLAYERS:
        response = await uploadPlayersFile(campaignUuid, file);
        break;
      case uploadActions.RESET_PLAYERS:
        response = await uploadResetPlayersFile(campaignUuid, file);
        break;
      case uploadActions.SOFT_RESET_PLAYERS:
        response = await uploadSoftResetPlayersFile(campaignUuid, file);
        break;
      default:
        return null;
    }

    if (response) {
      notify({
        title: I18n.t(actionsLabels[action]),
        level: response.error ? 'error' : 'success',
        message: `${I18n.t('COMMON.ACTIONS.UPLOADED')} ${response.error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') :
          I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    }

    this.resetForm();
    onCloseModal();
  };

  renderActions = () => {
    const { actions } = this.props;

    return (
      <Field
        name="action"
        label={I18n.t(attributeLabels.action)}
        component={SelectField}
      >
        <option value="">{I18n.t('COMMON.SELECT_OPTION.UPLOAD_ACTION')}</option>
        {actions.map(action => (
          <option key={action} value={action}>
            {renderLabel(action, actionsLabels)}
          </option>
        ))}
      </Field>
    );
  };

  render() {
    const {
      handleSubmit,
      isOpen,
      invalid,
      formValues,
    } = this.props;
    const { file, errors } = this.state;

    const action = get(formValues, 'action');

    return (
      <Modal isOpen={isOpen} toggle={this.handleClose}>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <ModalHeader toggle={this.handleClose}>
            {I18n.t(attributeLabels.title)}
          </ModalHeader>
          <ModalBody>
            <If condition={action}>
              <div className="text-center my-4">
                <span className="font-weight-700">
                  {renderLabel(action, actionsLabels)}
                </span>
                {' - '}
                {I18n.t(actionDescription[action])}
              </div>
            </If>
            <div className="row">
              <div className="col-md-6">
                {this.renderActions()}
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
                    <label>{I18n.t(attributeLabels.status)}</label>
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
              onClick={this.handleClose}
            >
              {I18n.t('COMMON.CANCEL')}
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

export default UploadPlayersModal;
