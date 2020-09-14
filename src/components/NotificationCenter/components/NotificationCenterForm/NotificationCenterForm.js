import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Formik, Form, Field } from 'formik';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import { notificationCenterTypesLabels } from 'constants/notificationCenter';
import renderLabel from 'utils/renderLabel';
import './NotificationCenterForm.scss';

class NotificationCenterForm extends PureComponent {
  static propTypes = {
    className: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    notificationsTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  onSubmit = ({ notificationTypes, read }) => {
    this.props.onSubmit(notificationTypes, read);
  };

  onReset = () => {
    this.props.onSubmit([]);
  };

  render() {
    const { className, notificationsTypes } = this.props;

    return (
      <Formik
        onSubmit={this.onSubmit}
        onReset={this.onReset}
        initialValues={{
          notificationTypes: [],
        }}
      >
        {({ dirty, handleReset }) => (
          <Form className={classNames('NotificationCenterForm', className)}>
            <div className="NotificationCenterForm__field">
              <Field
                name="notificationTypes"
                label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.NOTIFICATION_TYPE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                searchable
                multiple
              >
                {notificationsTypes.map(value => (
                  <option key={value} value={value}>
                    {I18n.t(renderLabel(value, notificationCenterTypesLabels))}
                  </option>
                ))}
              </Field>
            </div>
            <div className="NotificationCenterForm__field">
              <Field
                name="read"
                label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.READ_UNREAD')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                withAnyOption
              >
                <option key={0} value={0}>
                  {I18n.t('NOTIFICATION_CENTER.FILTERS.UNREAD')}
                </option>
                <option key={1} value={1}>
                  {I18n.t('NOTIFICATION_CENTER.FILTERS.READ')}
                </option>
              </Field>
            </div>
            <div className="NotificationCenterForm__button-group">
              <Button
                className="NotificationCenterForm__button"
                onClick={handleReset}
                disabled={!dirty}
                common
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                className="NotificationCenterForm__button"
                type="submit"
                primary
              >
                {I18n.t('COMMON.APPLY')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default NotificationCenterForm;
