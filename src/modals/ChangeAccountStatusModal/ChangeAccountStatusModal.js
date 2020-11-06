import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { Link } from 'components/Link';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import OperatorRelationsCountQuery from './graphql/OperatorRelationsCountQuery';
import './ChangeAccountStatusModal.scss';

const attributeLabels = {
  reason: 'COMMON.REASON',
};

class ChangeAccountStatusModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    reasons: PropTypes.objectOf(PropTypes.string).isRequired,
    fullName: PropTypes.string.isRequired,
    operatorRelationsCountQuery: PropTypes.query({
      operatorRelationsCount: PropTypes.shape({
        customersCount: PropTypes.number,
        leadsCount: PropTypes.number,
        rulesCount: PropTypes.number,
      }),
    }).isRequired,
  }

  handleSubmit = (values, { setSubmitting }) => {
    const { onSubmit, onCloseModal } = this.props;

    onSubmit(values, onCloseModal);
    setSubmitting(false);
  }

  renderMessage = ({
    name,
    link,
    count,
    operatorName,
  }) => (
    <p className={classNames({ ChangeAccountStatusModal__message: !operatorName })}>
      {operatorName && `${operatorName} `}
      {I18n.t(`MODALS.CHANGE_ACCOUNT_STATUS_MODAL.WARNING_${name}.BEFORE_LINK`, { count })}
      <Link to={link} className="ChangeAccountStatusModal__link">
        {I18n.t(`MODALS.CHANGE_ACCOUNT_STATUS_MODAL.WARNING_${name}.LINK`)}
      </Link>
      {I18n.t(`MODALS.CHANGE_ACCOUNT_STATUS_MODAL.WARNING_${name}.AFTER_LINK`)}
    </p>
  );

  renderMessages = () => {
    const {
      fullName,
      operatorRelationsCountQuery: { data },
    } = this.props;

    const {
      customersCount,
      leadsCount,
      rulesCount,
    } = data?.operatorRelationsCount || {};

    const isListType = (customersCount && leadsCount)
      || (customersCount && rulesCount)
      || (leadsCount && rulesCount);
    const operatorName = isListType ? null : fullName;

    return (
      <div>
        <If condition={isListType}>{fullName}</If>
        <If condition={customersCount}>
          {this.renderMessage({
            name: 'CLIENTS',
            link: '/clients/list',
            count: customersCount,
            operatorName,
          })}
        </If>
        <If condition={leadsCount}>
          {this.renderMessage({
            name: 'LEADS',
            link: '/leads/list',
            count: leadsCount,
            operatorName,
          })}
        </If>
        <If condition={rulesCount}>
          {this.renderMessage({
            name: 'RULES',
            link: '/sales-rules',
            count: rulesCount,
            operatorName,
          })}
        </If>
      </div>
    );
  };

  render() {
    const {
      isOpen,
      reasons,
      onCloseModal,
    } = this.props;

    const reasonsKeys = Object.keys(reasons);

    return (
      <Modal
        className="ChangeAccountStatusModal modal-danger"
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <ModalHeader
          toggle={onCloseModal}
        >
          {I18n.t('MODALS.CHANGE_ACCOUNT_STATUS_MODAL.TITLE')}
        </ModalHeader>

        <Formik
          initialValues={{
            reason: reasonsKeys.length === 1
              ? reasons[reasonsKeys[0]]
              : '',
          }}
          validate={
            createValidator({
              reason: ['required'],
            }, translateLabels(attributeLabels), false)
          }
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={this.handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalBody>
                <Field
                  name="reason"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.STATUS')}
                  label={I18n.t(attributeLabels.reason)}
                  component={FormikSelectField}
                >
                  {reasonsKeys.map(key => (
                    <option key={key} value={key}>
                      {I18n.t(renderLabel(key, reasons))}
                    </option>
                  ))}
                </Field>
                {this.renderMessages()}
              </ModalBody>

              <ModalFooter>
                <Button
                  onClick={onCloseModal}
                  common
                >
                  {I18n.t('COMMON.CANCEL')}
                </Button>

                <Button
                  disabled={isSubmitting}
                  type="submit"
                  danger
                >
                  {I18n.t('MODALS.CHANGE_ACCOUNT_STATUS_MODAL.SUBMIT_BUTTON')}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default withRequests({
  operatorRelationsCountQuery: OperatorRelationsCountQuery,
})(ChangeAccountStatusModal);
