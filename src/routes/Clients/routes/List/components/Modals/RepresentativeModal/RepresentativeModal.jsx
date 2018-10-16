import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../constants/propTypes';
import { deskTypes } from '../../../../../../../constants/hierarchyTypes';
import { salesStatuses, salesStatusValues } from '../../../../../../../constants/salesStatuses';
import { retentionStatuses, retentionStatusValues } from '../../../../../../../constants/retentionStatuses';
import { NasSelectField } from '../../../../../../../components/ReduxForm';
import Select from '../../../../../../../components/Select';
import renderLabel from '../../../../../../../utils/renderLabel';
import attributeLabels from './constants';

class RepresentativeModal extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.any,
    i18nPrefix: PropTypes.string.isRequired,
    clientsSelected: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    agents: PropTypes.arrayOf(PropTypes.userHierarchyType).isRequired,
    desks: PropTypes.arrayOf(PropTypes.hierarchyBranch).isRequired,
  };

  static defaultProps = {
    error: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedDesk: null,
      selectedRep: null,
      desks: props.desks,
      agents: props.agents,
    };
  }

  handleDeskChange = (selectedDesk) => {
    // deskId
    
  }

  handleRepChange = (selectedRep) => {
    // repId
  }

  render() {
    const {
      handleSubmit,
      onCloseModal,
      isOpen,
      invalid,
      pristine,
      submitting,
      onSubmit,
      error,
      i18nPrefix,
      clientsSelected,
      type,
    } = this.props;

    const {
      selectedDesk,
      selectedRep,
      desks,
      agents,
    } = this.state;

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <ModalHeader toggle={onCloseModal}>
          <div>{I18n.t(`CLIENTS.MODALS.${i18nPrefix}.HEADER`)}</div>
          <div className="font-size-11 color-yellow">{clientsSelected}{' '}{I18n.t('COMMON.CLIENTS_SELECTED')}</div>
        </ModalHeader>
        <ModalBody
          tag="form"
          id="representative-modal-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <If condition={error}>
            <div className="mb-2 text-center color-danger">
              {error}
            </div>
          </If>
          <span className="font-weight-600">{I18n.t(attributeLabels(i18nPrefix).desk)}</span>
          <Select
            value={selectedDesk}
            customClassName="form-group"
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
            disabled={submitting}
            onChange={this.handleDeskChange}
          >
            {desks.map(({ name, uuid }) => (
              <option key={uuid} value={uuid}>
                {name}
              </option>
            ))}
          </Select>
          <span className="font-weight-600">{I18n.t(attributeLabels(i18nPrefix).representative)}</span>
          <Select
            value={selectedRep}
            customClassName="form-group"
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
            disabled={submitting}
            onChange={this.handleRepChange}
          >
            {agents.map(({ fullName, uuid }) => (
              <option key={uuid} value={uuid}>
                {fullName}
              </option>
            ))}
          </Select>
          <Field
            name="status"
            label={I18n.t(attributeLabels(i18nPrefix).status)}
            component={NasSelectField}
            disabled={submitting}
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          >
            <Choose>
              <When condition={type === deskTypes.SALES}>
                {Object.entries(salesStatusValues).map(([, value]) => (
                  <option key={value} value={value}>
                    {renderLabel(value, salesStatuses)}
                  </option>
                ))}
              </When>
              <Otherwise>
                {Object.entries(retentionStatusValues).map(([, value]) => (
                  <option key={value} value={value}>
                    {renderLabel(value, retentionStatuses)}
                  </option>
                ))}
              </Otherwise>
            </Choose>
          </Field>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-default-outline"
            onClick={onCloseModal}
          >
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </button>
          <button
            type="submit"
            disabled={invalid || pristine || submitting}
            className="btn btn-primary"
            form="representative-modal-form"
          >
            {I18n.t('CLIENTS.MODALS.SUBMIT')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default RepresentativeModal;
