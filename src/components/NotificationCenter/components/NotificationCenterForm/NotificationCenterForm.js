import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Formik, Form, Field } from 'formik';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
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

  handleReset = () => {
    this.props.onSubmit([]);
  };

  render() {
    const { className, notificationsTypes } = this.props;

    return (
      <Formik
        onSubmit={this.onSubmit}
        initialValues={{
          notificationTypes: [],
        }}
      >
        {({ dirty }) => (
          <Form className={classNames('NotificationCenterForm', className)}>
            <Field
              name="notificationTypes"
              label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.NOTIFICATION_TYPE')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              component={FormikSelectField}
              className="NotificationCenterForm__field"
              searchable
              multiple
            >
              {notificationsTypes.map(value => (
                <option key={value} value={value}>
                  {I18n.t(`NOTIFICATION_CENTER.TYPES.${value}`)}
                </option>
              ))}
            </Field>
            <Field
              name="read"
              label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.READ_UNREAD')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              component={FormikSelectField}
              className="NotificationCenterForm__field"
              withAnyOption
            >
              <option key={0} value={0}>
                {I18n.t('NOTIFICATION_CENTER.FILTERS.UNREAD')}
              </option>
              <option key={1} value={1}>
                {I18n.t('NOTIFICATION_CENTER.FILTERS.READ')}
              </option>
            </Field>
            <div className="NotificationCenterForm__button-group">
              <Button
                className="NotificationCenterForm__button"
                onClick={this.handleReset}
                disabled={!dirty}
                primary
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
