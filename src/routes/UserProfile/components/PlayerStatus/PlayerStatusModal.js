import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { createValidator } from '../../../../utils/validator';
import { TextAreaField, SelectField } from '../../../../components/ReduxForm/UserProfile';
import { actions, durationUnits, selfExcludedDurationUnits } from '../../../../constants/user';

const attributeLabels = {
  period: 'Period',
  reason: 'Reason',
  comment: 'Comment',
};
const availablePeriods = [
  { durationAmount: 6, durationUnit: selfExcludedDurationUnits.MONTHS, label: '6 month' },
  { durationAmount: 1, durationUnit: selfExcludedDurationUnits.YEARS, label: '1 year' },
];
const periodValidation =
  `${availablePeriods.map(period => `${period.durationAmount} ` +
  `${period.durationUnit}`).join()},${durationUnits.PERMANENT}`;
const validator = (data) => {
  const rules = {
    comment: 'string',
  };

  if (data.reasons) {
    rules.reason = `required|string|in:${data.reasons.join()}`;
  }

  if (data.action === actions.SUSPEND || data.action === actions.PROLONG) {
    rules.period = `required|in:${periodValidation}`;
  }

  return createValidator(rules, attributeLabels, false)(data);
};

class PlayerStatusModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    show: PropTypes.bool,
    action: PropTypes.string.isRequired,
    reasons: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isOpen: false,
    show: false,
    title: '',
  };

  renderReasonsSelect = reasons => (
    <div className="form-group">
      <Field
        name="reason"
        label={attributeLabels.reason}
        component={SelectField}
        className={'form-control'}
      >
        <option value="">-- Select reason --</option>
        {reasons.map(item => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Field>
    </div>
  );

  renderPeriodSelect = () => (
    <div className="form-group">
      <Field
        name="period"
        label={attributeLabels.period}
        component={SelectField}
        className={'form-control'}
      >
        <option value="">-- Select period --</option>
        {
          availablePeriods.map(period => (
            <option value={`${period.durationAmount} ${period.durationUnit}`}>{period.label}</option>
          ))
        }
        <option value={durationUnits.PERMANENT}>Permanent</option>
      </Field>
    </div>
  );

  render() {
    const {
      show,
      action,
      reasons,
      title,
      onHide,
      onSubmit,
      handleSubmit,
      ...rest
    } = this.props;

    return (
      <Modal {...rest} isOpen={show} toggle={onHide}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {
            !!title &&
            <ModalHeader toggle={onHide}>
              {title}
            </ModalHeader>
          }
          <ModalBody>
            {(action === actions.SUSPEND || action === actions.PROLONG) && this.renderPeriodSelect()}
            {reasons && this.renderReasonsSelect(reasons)}

            <div className="form-group">
              <Field
                name="comment"
                placeholder="Comment..."
                label={attributeLabels.comment}
                component={TextAreaField}
                className={'form-control'}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              color="success"
              type="submit"
            >{action}</Button>
            {' '}
            <Button
              color="secondary"
              onClick={onHide}
            >Cancel</Button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default reduxForm({
  form: 'playerStatusModal',
  validate: validator,
})(PlayerStatusModal);
