import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { createValidator } from '../../../../utils/validator';
import { TextAreaField, SelectField } from '../../../../components/ReduxForm';
import { actions, suspendPeriods } from '../../../../constants/user';

const attributeLabels = {
  period: 'Period',
  reason: 'Reason',
  comment: 'Comment',
};
const validator = (data) => {
  const rules = {
    comment: 'string',
  };

  if (data.reasons) {
    rules.reason = `required|string|in:${data.reasons.join()}`;
  }

  if (data.action === actions.SUSPEND) {
    rules.period = `required|in:${Object.keys(suspendPeriods).join()}`;
  }

  return createValidator(rules, attributeLabels, false)(data);
};

class PlayerStatusModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    show: PropTypes.bool,
    action: PropTypes.string,
    reasons: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
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
        <option value={suspendPeriods.DAY}>Day</option>
        <option value={suspendPeriods.WEEK}>Week</option>
        <option value={suspendPeriods.MONTH}>Month</option>
        <option value={suspendPeriods.PERMANENT}>Permanent</option>
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
            {action === actions.SUSPEND && this.renderPeriodSelect()}
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
