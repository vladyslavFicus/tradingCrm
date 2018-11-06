import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { Modal, Button, DateTimeField } from '@newage/backoffice_ui';
import { Form, Field } from 'react-final-form';
import Uuid from '../Uuid';

class PlayerActivityReportModal extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    playerUUID: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
  };

  render() {
    const {
      isOpen,
      onClose,
      playerUUID,
      fullName,
      onSubmit,
    } = this.props;

    return (
      <Form
        onSubmit={onSubmit}
        initialValues={{
          date: moment().format('YYYY-MM-DD'),
        }}
        render={({ submitting, invalid, handleSubmit }) => (
          <Modal
            isOpen={isOpen}
            buttonLabel={I18n.t('common.cancel')}
            footerContent={
              <Button
                className="ml-auto"
                type="submit"
                form="activity-report-modal-form"
                disabled={submitting || invalid}
              >
                <If condition={submitting}>
                  <i className="fa fa-refresh fa-spin" /> {' '}
                </If>
                {I18n.t('common.confirm')}
              </Button>
            }
            onClose={onClose}
            header={I18n.t('component.PlayerActivityReportModal.header')}
          >
            <div className="text-center font-weight-600">
              {I18n.t('component.PlayerActivityReportModal.actionDescription', { fullName })} {'  '}
              <Uuid className="font-weight-normal" uuid={playerUUID} /> {I18n.t('common.account')}
              <div className="mt-3">
                {I18n.t('component.PlayerActivityReportModal.dateDescription')}
              </div>
            </div>
            <form id="activity-report-modal-form" className="row" onSubmit={handleSubmit}>
              <Field
                name="date"
                label={I18n.t('component.PlayerActivityReportModal.date')}
                component={DateTimeField}
                className="col-6 mt-3 mx-auto"
                dateFormat="YYYY-MM-DD"
                timeFormat={null}
              />
            </form>
          </Modal>
        )}
      />
    );
  }
}

export default PlayerActivityReportModal;
