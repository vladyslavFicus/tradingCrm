import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, FormikProps } from 'formik';
import { Button } from 'components/Buttons';
import useDistributionRuleSchedule, {
  FormValues,
} from 'routes/DistributionRules/hooks/useDistributionRuleSchedule';
import DistributionRuleScheduleSettings from './components/DistributionRuleScheduleSettings';
import './DistributionRuleSchedule.scss';

const DistributionRuleSchedule = () => {
  const {
    scheduleBoard,
    handleSubmit,
  } = useDistributionRuleSchedule();

  return (
    <div className="DistributionRuleScheduleForm">
      <Formik
        initialValues={{
          schedule: {
            days: scheduleBoard,
          },
        }}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik: FormikProps<FormValues>) => (
          <Form>
            <div className="DistributionRuleScheduleForm__common">
              <DistributionRuleScheduleSettings formik={formik} />

              <If condition={formik.dirty}>
                <div className="DistributionRuleScheduleForm__not-saved-message">
                  {I18n.t('CLIENTS_DISTRIBUTION.RULE.NOT_SAVED')}
                </div>
              </If>
            </div>

            <div className="DistributionRuleScheduleForm__actions">
              <Button
                primary
                type="submit"
                className="DistributionRuleScheduleForm__actions-btn"
                data-testid="DistributionRuleSchedule-saveButton"
                disabled={!formik.dirty || formik.isSubmitting}
              >
                {I18n.t('COMMON.SAVE')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default React.memo(DistributionRuleSchedule);
