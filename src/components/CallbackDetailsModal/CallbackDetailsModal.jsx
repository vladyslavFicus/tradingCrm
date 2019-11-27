import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import NoteButton from 'components/NoteButton';
import ShortLoader from 'components/ShortLoader';
import PropTypes from '../../constants/propTypes';
import { createValidator } from '../../utils/validator';
import { callbacksStatuses } from '../../constants/callbacks';
import { NasSelectField, DateTimeField } from '../ReduxForm';
import Uuid from '../Uuid';

class CallbackDetailsModal extends Component {
  static propTypes = {
    callback: PropTypes.object.isRequired,
    operators: PropTypes.object.isRequired,
    className: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    updateCallback: PropTypes.func.isRequired,
    error: PropTypes.string,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    pristine: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    error: null,
    submitting: false,
    valid: false,
    pristine: true,
  };

  handleSubmit = async ({ callbackId, operatorId, callbackTime, status }) => {
    const { notify, onCloseModal } = this.props;

    const { data: { callback: { update: { error } } } } = await this.props.updateCallback({
      variables: {
        callbackId,
        operatorId,
        callbackTime,
        status,
      },
    });

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('CALLBACKS.MODAL.TITLE'),
      message: error
        ? I18n.t('COMMON.SOMETHING_WRONG')
        : I18n.t('CALLBACKS.MODAL.SUCCESSFULLY_UPDATED'),
    });

    if (!error) {
      onCloseModal();
    }
  };

  render() {
    const {
      isOpen,
      onCloseModal,
      className,
      callback: { loading: callbackLoading, callback: callbackData },
      operators,
      operators: { loading },
      handleSubmit,
      error,
      submitting,
      valid,
      pristine,
    } = this.props;

    const operatorsList = get(operators, 'operators.data.content', []);
    const callback = get(callbackData, 'data');

    return (
      <Modal isOpen={isOpen} toggle={onCloseModal} className={classNames(className, 'callback-detail-modal')}>
        <ModalHeader toggle={onCloseModal}>{I18n.t('CALLBACKS.MODAL.TITLE')}</ModalHeader>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <ModalBody>
            <Choose>
              <When condition={callbackLoading}>
                <ShortLoader />
              </When>
              <Otherwise>
                <div>
                  <If condition={callback.client}>
                    <div className="font-weight-700">
                      {callback.client.fullName}
                    </div>
                  </If>
                  <div className="font-size-11 mb-3">
                    {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={callback.operatorId} />
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
                    placeholder={I18n.t(loading ? 'COMMON.SELECT_OPTION.LOADING' : 'CALLBACKS.MODAL.SELECT_OPERATOR')}
                    disabled={loading}
                    component={NasSelectField}
                    searchable
                  >
                    {operatorsList.map(item => (
                      <option key={item.uuid} value={item.uuid}>{item.fullName}</option>
                    ))}
                  </Field>
                  <Field
                    withTime
                    closeOnSelect={false}
                    name="callbackTime"
                    label={I18n.t('CALLBACKS.MODAL.CALLBACK_DATE_AND_TIME')}
                    component={DateTimeField}
                    isValidDate={() => (true)}
                  />
                  <Field
                    name="status"
                    label={I18n.t('CALLBACKS.MODAL.STATUS')}
                    component={NasSelectField}
                    searchable={false}
                  >
                    {Object.keys(callbacksStatuses).map(status => (
                      <option key={status} value={status}>
                        {I18n.t(callbacksStatuses[status])}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="d-flex justify-content-center">
                  <NoteButton
                    id={`callback-details-note-${callback.callbackId}`}
                    targetUUID={callback.callbackId}
                    playerUUID={callback.userId}
                    note={callback.note}
                  />
                </div>
              </Otherwise>
            </Choose>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseModal}>{I18n.t('COMMON.CANCEL')}</Button>
            <Button
              type="submit"
              color="primary"
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
    status: ['required'],
  }, attributeLabels, false),
})(CallbackDetailsModal);
