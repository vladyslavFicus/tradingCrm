import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { createValidator } from '../../../../../../utils/validator';
import { TextAreaField, SelectField } from '../../../../../../components/ReduxForm';
import { actions, durationUnits, actionsLabels } from '../../../../../../constants/user';
import pluralDurationUnit from '../../../../../../utils/pluralDurationUnit';
import renderLabel from '../../../../../../utils/renderLabel';
import { shortify } from '../../../../../../utils/uuid';

const attributeLabels = {
  period: 'Period',
  reason: 'Reason',
  comment: 'Comment',
};
const availablePeriods = [
  { durationAmount: 1, durationUnit: durationUnits.MONTHS },
  { durationAmount: 6, durationUnit: durationUnits.MONTHS },
  { durationAmount: 1, durationUnit: durationUnits.YEARS },
  { durationAmount: 2, durationUnit: durationUnits.YEARS },
  { durationAmount: 5, durationUnit: durationUnits.YEARS },
];

const periodValidation =
  `${availablePeriods.map(period => `${period.durationAmount} ` +
    `${period.durationUnit}`).join()},${durationUnits.PERMANENT}`;

class PlayerStatusModal extends Component {
  static propTypes = {
    action: PropTypes.string.isRequired,
    reasons: PropTypes.object,
    title: PropTypes.string,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    profileName: PropTypes.string,
    profileUuid: PropTypes.string,
  };
  static defaultProps = {
    title: '',
    reasons: null,
    profileName: '',
    profileUuid: '',
  };

  renderReasonsSelect = reasons => (
    <Field
      name="reason"
      label={attributeLabels.reason}
      component={SelectField}
    >
      <option value="">{I18n.t('COMMON.SELECT_OPTION.REASON')}</option>
      {Object.keys(reasons).map(key => (
        <option key={key} value={key}>
          {renderLabel(key, reasons)}
        </option>
      ))}
    </Field>
  );

  renderPeriodSelect = () => (
    <Field
      name="period"
      label={attributeLabels.period}
      component={SelectField}
    >
      <option value="">{I18n.t('COMMON.SELECT_OPTION.PERIOD')}</option>
      {
        availablePeriods.map(period => (
          <option
            value={`${period.durationAmount} ${period.durationUnit}`}
            key={`${period.durationAmount}-${period.durationUnit}`}
          >
            {pluralDurationUnit(period.durationAmount, period.durationUnit, this.props.locale)}
          </option>
        ))
      }
      <option value={durationUnits.PERMANENT}>Permanent</option>
    </Field>
  );

  render() {
    const {
      action,
      reasons,
      title,
      onHide,
      onSubmit,
      handleSubmit,
      profileName,
      profileUuid,
    } = this.props;

    return (
      <Modal isOpen toggle={onHide} className="modal-danger">
        <ModalHeader toggle={onHide}>
          {title}
        </ModalHeader>
        <ModalBody tag="form" onSubmit={handleSubmit(onSubmit)} id="player-status-modal-form">
          <If condition={action === actions.MANUAL_COOLOFF}>
            <div
              className="margin-bottom-20 text-center font-weight-700"
              dangerouslySetInnerHTML={{
                __html: I18n.t('MANUAL_COOLOFF.HEADING', {
                  profileName,
                  uuid: `<span class="d-inline-block font-weight-300">${shortify(profileUuid)}</span>`,
                }),
              }}
            />
          </If>
          <If condition={action === actions.SUSPEND || action === actions.PROLONG}>
            {this.renderPeriodSelect()}
          </If>
          <If condition={reasons}>
            {this.renderReasonsSelect(reasons)}
          </If>
          <Field
            name="comment"
            placeholder="Comment..."
            label={attributeLabels.comment}
            component={TextAreaField}
          />
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-default-outline mr-auto"
            onClick={onHide}
          >
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </button>
          <button
            type="submit"
            className="btn btn-danger"
            form="player-status-modal-form"
          >
            {renderLabel(action, actionsLabels)}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default reduxForm({
  form: 'playerStatusModal',
  validate: (data, props) => {
    const rules = {
      comment: 'string',
    };

    if (data.action === actions.SUSPEND || data.action === actions.PROLONG) {
      rules.period = `required|in:${periodValidation}`;
    }

    if (props.reasons && Object.keys(props.reasons).length) {
      rules.reason = `required|string|in:${Object.keys(props.reasons).join()}`;
    }

    return createValidator(rules, attributeLabels, false)(data);
  },
})(PlayerStatusModal);
