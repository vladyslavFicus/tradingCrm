import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, FormikProps } from 'formik';
import { useParams } from 'react-router-dom';
import { parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Button } from 'components/UI';
import DistributionRuleScheduleSettings from './components/DistributionRuleScheduleSettings';
import { useDistributionRuleQuery } from './graphql/__generated__/DistributionRuleQuery';
import { useUpdateRuleDaysOfWeekMutation } from './graphql/__generated__/UpdateRuleDaysOfWeekMutation';
import './DistributionRuleSchedule.scss';

type DaysOfWeek = Array<string>;

type FormValues = {
  schedule: {
    days: DaysOfWeek,
  },
};

const DistributionRuleSchedule = () => {
  const { id: uuid } = useParams<{ id: string }>();

  const { data } = useDistributionRuleQuery({
    variables: {
      uuid,
    },
  });

  const [updateRuleDaysOfWeek] = useUpdateRuleDaysOfWeekMutation();
  const scheduleBoard = data?.distributionRule.executionDaysOfWeek || [];

  const handleSubmit = async ({ schedule: { days } }: FormValues) => {
    try {
      await updateRuleDaysOfWeek({
        variables: {
          uuid,
          executionDaysOfWeek: days,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.SUCCESS_TITLE'),
        message: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.SUCCESS_MESSAGE'),
      });
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_TITLE'),
        message:
          error === 'error.entity.not.complete'
            ? I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.INCOMPLETE_STATUS')
            : I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_MESSAGE'),
      });
    }
  };

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
