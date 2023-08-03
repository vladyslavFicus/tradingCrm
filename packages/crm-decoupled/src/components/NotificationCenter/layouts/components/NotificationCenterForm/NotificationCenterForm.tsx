import React from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Field, Form, Formik } from 'formik';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { Filter } from 'components/NotificationCenter/types';
import { readTypes } from 'components/NotificationCenter/constants';
import useNotificationCenterForm from 'components/NotificationCenter/hooks/useNotificationCenterForm';
import './NotificationCenterForm.scss';

type Props = {
  className: string,
  notificationTypes: Array<string>,
  onSubmit: (props: Filter) => void,
};

const NotificationCenterForm = (props: Props) => {
  const { className, notificationTypes, onSubmit } = props;

  const { handleReset } = useNotificationCenterForm({ onSubmit });

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{}}
    >
      {({ dirty, resetForm }) => (
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
            {notificationTypes.map(value => (
              <option key={value} value={value}>
                {I18n.t(`NOTIFICATION_CENTER.TYPES.${value}`)}
              </option>
            ))}
          </Field>

          <Field
            name="read"
            className="NotificationCenterForm__field"
            label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.READ_UNREAD')}
            placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
            component={FormikSelectField}
            withAnyOption
            withFocus
          >
            {readTypes.map(({ value, label }) => (
              // @ts-ignore because in tsx file Field can't set BOOLEAN to option value
              <option key={`readTypes-${value}`} value={value}>
                {I18n.t(label)}
              </option>
            ))}
          </Field>

          <div className="NotificationCenterForm__button-group">
            <Button
              className="NotificationCenterForm__button"
              onClick={() => handleReset(resetForm)}
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
};

export default React.memo(NotificationCenterForm);
