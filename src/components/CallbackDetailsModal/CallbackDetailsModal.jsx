import React, { Component } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { get } from 'lodash';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from '../../constants/propTypes';
import NoteButton from '../NoteButton';
import { NasSelectField, DateTimeField } from '../ReduxForm';
import { createValidator } from '../../utils/validator';
import parserErrorsFromServer from '../../utils/parseErrorsFromServer';

class CallbackDetailsModal extends Component {
  static propTypes = {
    callback: PropTypes.object,
    className: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onNoteClick: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    pristine: PropTypes.bool,
    fetchOperators: PropTypes.func.isRequired,
  };
  static defaultProps = {
    callback: null,
    className: '',
    onNoteClick: null,
    error: null,
    submitting: false,
    valid: false,
    pristine: true,
  };

  state = {
    operatorsList: [],
  };

  componentDidMount() {
    this.fetchOperators();
  }

  fetchOperators = async () => {
    const result = await this.props.fetchOperators({ size: 200 });

    if(!result || result.error) {
      return;
    }
    const operatorsList = get(result, 'payload.content', []);
    this.setState({ operatorsList });
  };

  handleSubmit = async (data) => {
    const result = await this.props.onSubmit(data);

    if (!result || result.error) {
      const fieldErrors = get(result, 'payload.response.fields_errors', {});
      const errors = parserErrorsFromServer(fieldErrors);
      throw new SubmissionError(errors && Object.keys(errors).length
        || { _error: get(result, 'payload.response.message') || I18n.t('COMMON.SOMETHING_WRONG') });
    }

    this.props.onClose(true);
  };

  render() {
    const {
      onClose,
      className,
      onNoteClick,
      callback,
      handleSubmit,
      error,
      submitting,
      valid,
      pristine,
    } = this.props;

    const { operatorsList } = this.state;

    if (!callback) {
      return null;
    }

    return (
      <Modal isOpen toggle={onClose} centered className={classNames(className, 'callback-detail-modal')}>
        <ModalHeader toggle={onClose}>{I18n.t('CALLBACKS.MODAL.TITLE')}</ModalHeader>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <ModalBody>
            <div>
              <div className="font-weight-700">
                CB-{callback.callbackId.split('-')[0]}
              </div>
              <div className="font-size-11">
                {I18n.t('COMMON.AUTHOR_BY')} {callback.operatorId}
              </div>
            </div>
            <div>
              <If condition={error}>
                <div className="alert alert-warning animated fadeIn">
                  {error}
                </div>
              </If>
              <Field
                name="operatorId"
                label={I18n.t('CALLBACKS.MODAL.OPERATOR')}
                placeholder={I18n.t('CALLBACKS.MODAL.SELECT_OPERATOR')}
                component={NasSelectField}
                searchable
              >
                {operatorsList.map((item, index) => (
                  <option key={index} value={item.uuid}>{ `${item.firstName} ${item.lastName}`}</option>
                ))}
              </Field>
              <Field
                utc
                name="callbackTime"
                label={I18n.t('CALLBACKS.MODAL.CALLBACK_DATE_AND_TIME')}
                component={DateTimeField}
                isValidDate={() => (true)}
              />
            </div>
            <div className="text-center">
              <NoteButton
                id="payment-detail-modal-note"
                note={callback.note}
                onClick={onNoteClick}
                targetEntity={callback}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={onClose}
            >
              {I18n.t('COMMON.CANCEL')}
            </Button>
            <Button
              type="submit"
              disabled={pristine || submitting || !!error || !valid}
            >
              {I18n.t('COMMON.SAVE_CHANGES')}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

const attributeLabels = {
  operatorId: I18n.t('CALLBACKS.MODAL.OPERATOR'),
  callbackTime: I18n.t('CALLBACKS.GRID_HEADER.TIME'),
};

export default reduxForm({
  form: 'callback-form',
  validate: createValidator({
    operatorId: ['required'],
    callbackTime: ['required'],
  }, attributeLabels, false),
})(CallbackDetailsModal);
