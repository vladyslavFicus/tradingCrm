import React, { Component, PropTypes } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { createValidator } from 'utils/validator';
import { actions, statusActions } from 'config/user';

const attributeLabels = {
  reason: 'Reason',
  comment: 'Comment',
};
const validator = (data) => {
  const rules = {
    comment: 'string',
  };

  if (data.reasons) {
    rules.reason = `required|string|in:${data.reasons.join(',')}`;
  }

  if (data.action === actions.SUSPEND) {
    rules.period = 'required|in:day,week,month,permanent';
  }

  return createValidator(rules, attributeLabels, false)(data);
};

class AccountStatusModal extends Component {
  render() {
    const {
      show,
      action,
      reasons,
      title,
      onHide,
      onSubmit,
      handleSubmit,
      ...rest,
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
                component={'textarea'}
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

  renderReasonsSelect = (reasons) => {
    return <div className="form-group">
      <Field
        name="reason"
        label={attributeLabels.reason}
        component={'select'}
        className={'form-control'}
      >
        <option>-- Select reason --</option>
        {reasons.map(item => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Field>
    </div>;
  };

  renderPeriodSelect = () => {
    return <div className="form-group">
      <Field
        name="period"
        label={attributeLabels.reason}
        component={'select'}
        className={'form-control'}
      >
        <option>-- Select period --</option>
        <option value={'day'}>Day</option>
        <option value={'week'}>Week</option>
        <option value={'month'}>Month</option>
        <option value={'permanent'}>Permanent</option>
      </Field>
    </div>;
  }
}

AccountStatusModal.propTypes = {
  isOpen: PropTypes.bool,
};

export default reduxForm({
  form: 'accountStatusModal',
  validate: validator,
})(AccountStatusModal);
