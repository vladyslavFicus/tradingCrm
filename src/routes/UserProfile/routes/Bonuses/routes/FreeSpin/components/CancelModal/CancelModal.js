import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getFormValues, Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import PropTypes from '../../../../../../../../constants/propTypes';
import renderLabel from '../../../../../../../../utils/renderLabel';
import { createValidator } from '../../../../../../../../utils/validator';
import { TextAreaField, SelectField } from '../../../../../../../../components/ReduxForm';
import Uuid from '../../../../../../../../components/Uuid';
import { actionLabels } from '../../../../../../../../constants/free-spin';
import { attributeLabels } from './constants';
import './CancelModal.scss';

const CUSTOM_REASON = 'custom';
const FORM_NAME = 'freeSpinCancelModal';

class CancelModal extends Component {
  static propTypes = {
    item: PropTypes.freeSpinEntity.isRequired,
    isOpen: PropTypes.bool,
    action: PropTypes.string,
    reasons: PropTypes.object,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    customReason: PropTypes.bool,
    submitButtonLabel: PropTypes.string,
    submitButtonClassName: PropTypes.string,
    currentValues: PropTypes.shape({
      reason: PropTypes.string,
      customReason: PropTypes.string,
    }).isRequired,
  };
  static defaultProps = {
    isOpen: false,
    handleSubmit: null,
    action: null,
    reasons: {},
    submitButtonLabel: 'Submit',
    submitButtonClassName: '',
    customReason: false,
    currentValues: {
      reason: '',
      customReason: '',
    },
  };

  handleSubmit = ({ reason, customReason }) => {
    const { onSubmit, action } = this.props;

    return onSubmit({ reason: customReason || reason, action });
  };

  renderReasonsSelect = (reasons, customReason = false) => (
    <div className="form-group">
      <Field
        name="reason"
        label={I18n.t(attributeLabels.reason)}
        component={SelectField}
        position="vertical"
        className={'form-control'}
      >
        <option value="">
          {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CANCEL.SELECT_REASON_OPTION')}
        </option>
        {Object.keys(reasons).map(key => (
          <option key={key} value={key}>
            {I18n.t(reasons[key])}
          </option>
        ))}
        {
          customReason &&
          <option value="custom">
            {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CANCEL.CUSTOM_REASON_OPTION')}
          </option>
        }
      </Field>
    </div>
  );

  render() {
    const {
      action,
      submitButtonLabel,
      submitButtonClassName,
      reasons,
      onHide,
      onSubmit,
      handleSubmit,
      customReason,
      currentValues,
      item,
      ...rest
    } = this.props;

    return (
      <Modal {...rest} className="free-spin-cancel-modal" toggle={onHide}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={onHide}>
            {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CANCEL.TITLE')}
          </ModalHeader>
          <ModalBody>
            <div className="text-center margin-vertical-20">
              <span className="font-weight-700">
                {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CANCEL.ACTION_TEXT', {
                  title: item.name,
                  action: renderLabel(action, actionLabels).toLowerCase(),
                })}
              </span>
              {' - '}
              <Uuid uuid={item.uuid} />
              {' - '}
              <span className="font-weight-700">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CANCEL.ENTITY_NAME')}</span>
            </div>
            {reasons && Object.keys(reasons).length > 0 && this.renderReasonsSelect(reasons, customReason)}
            {
              currentValues && currentValues.reason === CUSTOM_REASON &&
              <Field
                name="customReason"
                placeholder={I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CANCEL.CUSTOM_REASON_PLACEHOLDER')}
                label={''}
                position="vertical"
                component={TextAreaField}
              />
            }
          </ModalBody>

          <ModalFooter>
            <div className="row">
              <div className="col-md-6">
                <button className="btn btn-default-outline text-uppercase" onClick={onHide}>
                  {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CANCEL.CANCEL_BUTTON')}
                </button>
              </div>
              <div className="col-md-6 text-right">
                <button className={classNames(submitButtonClassName, 'btn text-uppercase')} type="submit">
                  {I18n.t(submitButtonLabel)}
                </button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate: (data) => {
      const rules = {
        reason: 'string',
      };

      if (data.reasons) {
        rules.reason = `required|string|in:${Object.keys(data.reasons).join()},custom`;
      }

      if (data.reason === CUSTOM_REASON) {
        rules.customReason = 'required|string|min:3';
      }

      return createValidator(rules, attributeLabels, false)(data);
    }
    ,
  })(CancelModal),
);
