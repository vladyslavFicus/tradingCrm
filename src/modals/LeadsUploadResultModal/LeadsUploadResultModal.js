/* eslint-disable */

import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { withRequests, parseErrors } from 'apollo';
import { compose } from 'react-apollo';
import PropTypes from 'constants/propTypes';
import withNotifications from 'hoc/withNotifications';
import { Button } from 'components/UI';
import DeleteBranchMutation from './graphql/DeleteBranchMutation';
import './LeadsUploadResultModal.scss';

const columns = [
  'name',
  'surname',
  'phone',
  'mobile',
  'email',
  'country',
  'city',
  'birthDate',
  'gender',
  'language',
  'source',
  'affiliate',
  'salesAgent',
  'errorReason',
];

const rows = [
  {
    name: '',
    surname: '',
    phone: '38094577548',
    mobile: '',
    email: 'djfkdjfkd@gmail.com',
    country: '',
    city: '',
    birthDate: '',
    gender: '',
    language: '',
    source: '',
    affiliate: '',
    salesAgent: '',
    processingStatus: 'EMAIL_UNIQUENESS_FAILED',
  },
  {
    phone: '380945343434',
    email: '4444444@gmail.com',
  },
  {
    phone: '380945343434',
    email: '4444444@gmail.com',
  }
];

class LeadsUploadResultModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  state = {
    isSubmitting: false,
    errors: null,
  };

  handleClose = () => {
    const { onCloseModal } = this.props;

    onCloseModal();
  }

  createCsvFile = () => {
    return encodeURI(`data:text/csv;charset=utf-8, ${
      [
        columns,
        ...rows.map(item => columns.map(column => {
          
          if (column === 'errorReason') {
            return item['processingStatus'] === 'EMAIL_UNIQUENESS_FAILED' ? 'mail duplication' : 'phone duplication';
          }
          
          return item[column] || '-';
        })),
      ].map(e => e.join(",")).join("\n")
    }`)
  }

  render() {
    const {
      isOpen,
    } = this.props;

    const { isSubmitting, errors } = this.state;

    return (
      <Modal className="LeadsUploadResultModal" isOpen={isOpen} toggle={this.handleClose}>
        <ModalHeader toggle={this.handleClose}>{I18n.t('MODALS.LEADS_UPLOAD_RESULT_MODAL.TITLE')}</ModalHeader>
        <ModalBody>
          <div className="LeadsUploadResultModal__row LeadsUploadResultModal__action-text">
            {I18n.t('MODALS.LEADS_UPLOAD_RESULT_MODAL.DESCRIPTION', { count: rows.length })}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            commonOutline
            onClick={this.handleClose}
          >
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </Button>
          <Button
            danger
            disabled={isSubmitting || errors}
          >
            <a href={this.createCsvFile()} download="report">{I18n.t('COMMON.BUTTONS.DOWNLOAD')}</a>
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    deleteBranch: DeleteBranchMutation,
  }),
)(LeadsUploadResultModal);
