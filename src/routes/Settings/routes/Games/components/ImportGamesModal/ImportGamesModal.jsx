import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { attributeLabels } from '../../constants';
import stopPropagation from '../../../../../../utils/stopPropagation';
import { NasSelectField, FileInput } from '../../../../../../components/ReduxForm';

class ImportGamesModal extends Component {
  static propTypes = {
    uploadFile: PropTypes.func.isRequired,
    getAggregators: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    aggregators: PropTypes.arrayOf(PropTypes.string).isRequired,
    notify: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getAggregators();
  }

  componentDidUpdate({ isOpen }) {
    if (!this.props.isOpen && isOpen) {
      this.props.reset();
    }
  }

  handleSubmit = async ({ aggregatorId, file }) => {
    const { onCloseModal, reset, notify } = this.props;
    const result = await this.props.uploadFile(file[0], aggregatorId);

    notify({
      level: result.error ? 'error' : 'success',
      title: I18n.t('GAMES.IMPORT_MODAL.HEADER'),
      message: I18n.t(`GAMES.IMPORT_MODAL.NOTIFICATIONS.${result.error ? 'UNSUCCESSFULLY' : 'SUCCESSFULLY'}`),
    });

    if (result.error) {
      throw new SubmissionError();
    }

    onCloseModal();
    reset();
  };

  render() {
    const {
      onCloseModal,
      handleSubmit,
      isOpen,
      submitting,
      aggregators,
    } = this.props;

    return (
      <Modal toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>{I18n.t('GAMES.IMPORT_MODAL.HEADER')}</ModalHeader>
        <ModalBody
          tag="form"
          className="game-import-modal row"
          onSubmit={e => stopPropagation(e, handleSubmit(this.handleSubmit))}
          id="game-import"
        >
          <Field
            name="aggregatorId"
            label={I18n.t(attributeLabels.gameAggregator)}
            component={NasSelectField}
            searchable={false}
            showErrorMessage={false}
            className="col-md-6"
          >
            {[
              <option key="all" value="">{I18n.t('GAMES.IMPORT_MODAL.AGGREGATOR.ALL')}</option>,
              ...aggregators.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
            ))]}
          </Field>
          <Field
            name="file"
            label={I18n.t(attributeLabels.file)}
            component={FileInput}
            showErrorMessage={false}
            className="col-md-6 "
          />
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            onClick={onCloseModal}
            className="btn btn-primary"
          >
            {I18n.t('COMMON.CANCEL')}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            form="game-import"
          >
            {I18n.t('COMMON.IMPORT')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ImportGamesModal;
