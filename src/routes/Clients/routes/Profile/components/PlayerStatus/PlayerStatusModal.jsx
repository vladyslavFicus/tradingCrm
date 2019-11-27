import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import I18n from 'i18n-js';
import { withStorage } from 'providers/StorageProvider';
import { createValidator } from '../../../../../../utils/validator';
import { TextAreaField, SelectField } from '../../../../../../components/ReduxForm';
import { actions, durationUnits } from '../../../../../../constants/user';
import pluralDurationUnit from '../../../../../../utils/pluralDurationUnit';
import renderLabel from '../../../../../../utils/renderLabel';


const attributeLabels = {
  period: 'Period',
  reason: 'Reason',
  comment: 'Comment',
};
const availablePeriods = [
  { durationAmount: 6, durationUnit: durationUnits.MONTHS },
  { durationAmount: 1, durationUnit: durationUnits.YEARS },
  { durationAmount: 2, durationUnit: durationUnits.YEARS },
  { durationAmount: 5, durationUnit: durationUnits.YEARS },
];

const periodValidation = `${availablePeriods.map(period => `${period.durationAmount} `
  + `${period.durationUnit}`).join()},${durationUnits.PERMANENT}`;

class PlayerStatusModal extends Component {
  static propTypes = {
    action: PropTypes.string.isRequired,
    reasons: PropTypes.object.isRequired,
    title: PropTypes.string,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    className: 'modal-danger',
  };

  renderReasonsSelect = reasons => (
    <Field
      name="reason"
      label={attributeLabels.reason}
      component={SelectField}
      position="vertical"
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
      position="vertical"
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
      className,
    } = this.props;

    return (
      <Modal isOpen toggle={onHide} className={className}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {
            !!title
            && (
              <ModalHeader toggle={onHide}>
                {title}
              </ModalHeader>
            )
          }
          <ModalBody>
            {(action === actions.SUSPEND || action === actions.PROLONG) && this.renderPeriodSelect()}
            {reasons && this.renderReasonsSelect(reasons)}

            <Field
              name="comment"
              placeholder="Comment..."
              label={attributeLabels.comment}
              component={TextAreaField}
            />
          </ModalBody>

          <ModalFooter>
            <button type="button" className="btn btn-default-outline mr-auto" onClick={onHide}>
              {I18n.t('COMMON.BUTTONS.CANCEL')}
            </button>
            <button type="submit" className="btn btn-danger">
              {action}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default withStorage(['locale'])(reduxForm({
  form: 'playerStatusModal',
  validate: (data, props) => {
    const rules = {
      comment: 'string',
      reason: `required|string|in:${Object.keys(props.reasons).join()}`,
    };

    if (data.action === actions.SUSPEND || data.action === actions.PROLONG) {
      rules.period = `required|in:${periodValidation}`;
    }

    return createValidator(rules, attributeLabels, false)(data);
  },
})(PlayerStatusModal));
