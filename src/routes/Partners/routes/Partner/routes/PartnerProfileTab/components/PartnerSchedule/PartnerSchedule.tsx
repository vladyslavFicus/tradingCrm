import React, { useEffect, useMemo, useState } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import compose from 'compose-function';
import classNames from 'classnames';
import { withModals } from 'hoc';
import { Modal } from 'types';
import { SetFieldValue } from 'types/formik';
import { Partner, Partner__Schedule as Schedule } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import countryList from 'utils/countryList';
import { Button } from 'components/Buttons';
import { Table, Column } from 'components/Table';
import { FormikCheckbox } from 'components/Formik';
import PartnerScheduleModal from 'modals/PartnerScheduleModal';
import { useChangeScheduleStatusMutation } from './graphql/__generated__/ChangeScheduleStatusMutation';
import './PartnerSchedule.scss';

type ScheduleDays = Record<string, boolean>;

type Props = {
  partner: Partner,
  modals: {
    partnerScheduleModal: Modal,
  },
  onRefetch: () => void,
};

const PartnerSchedule = (props: Props) => {
  const {
    partner: {
      uuid,
      schedule,
    },
    modals: {
      partnerScheduleModal,
    },
    onRefetch,
  } = props;

  const partnerSchedule = schedule || [];

  const [checkedDays, setCheckedDays] = useState<ScheduleDays>({});

  const getInitSchedule = useMemo(() => partnerSchedule
    .reduce((acc, { day, activated }) => ({ ...acc, [day]: activated }), {} as ScheduleDays),
  [partnerSchedule]);

  // ===== Requests ===== //
  const [changeScheduleStatusMutation] = useChangeScheduleStatusMutation();

  // ===== Handlers ===== //
  const handleSubmit = async () => {
    try {
      await changeScheduleStatusMutation({
        variables: {
          affiliateUuid: uuid,
          data: Object.keys(checkedDays).map(day => ({ day, activated: checkedDays[day] })),
        },
      });

      onRefetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PARTNERS.MODALS.SCHEDULE.NOTIFICATIONS.UPDATE_STATUS.TITLE'),
        message: I18n.t('COMMON.SUCCESS'),

      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('PARTNERS.MODALS.SCHEDULE.NOTIFICATIONS.UPDATE_STATUS.TITLE'),
        message: I18n.t('COMMON.ERROR'),
      });
    }
  };

  const hansleShowEditScheduleModal = (value: Schedule) => {
    partnerScheduleModal.show({
      ...value,
      activated: checkedDays[value.day],
      affiliateUuid: uuid,
      refetch: onRefetch,
    });
  };

  const handleChangeActivate = (day: string, setFieldValue: SetFieldValue<ScheduleDays>) => {
    const checked = !checkedDays[day];

    setCheckedDays(prevState => ({ ...prevState, [day]: checked }));

    setFieldValue(day, checked);
  };

  // ===== Effects ===== //
  useEffect(() => {
    setCheckedDays(getInitSchedule);
  }, [schedule]);

  // ===== Renders ===== //
  const renderActivate = (value: Schedule, setFieldValue: SetFieldValue<ScheduleDays>) => (
    <Field
      name={value.day}
      disabled={!value.configId}
      onChange={() => handleChangeActivate(value.day, setFieldValue)}
      component={FormikCheckbox}
    />
  );

  const renderDay = ({ day }: Schedule) => (
    <Choose>
      <When condition={!!day}>
        <div className="PartnerSchedule__general">{I18n.t(`PARTNERS.SCHEDULE.WEEK.${day}`)}</div>
      </When>

      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  const renderHours = ({ workingHoursFrom, workingHoursTo }: Schedule) => (
    <Choose>
      <When condition={!!workingHoursFrom && !!workingHoursTo}>
        <div className="PartnerSchedule__general">
          {`
            ${I18n.t('PARTNERS.SCHEDULE.FROM')} ${moment(workingHoursFrom || '', 'HH:mm:ss').format('HH:mm')}
            ${I18n.t('PARTNERS.SCHEDULE.TO')} ${moment(workingHoursTo || '', 'HH:mm:ss').format('HH:mm')}
          `}
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  const renderLimit = ({ totalLimit }: Schedule) => (
    <Choose>
      <When condition={totalLimit !== null}>
        <div className="PartnerSchedule__general">{totalLimit}</div>
      </When>

      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  const renderCountry = ({ countrySpreads }: Schedule) => (
    <Choose>
      <When condition={!!countrySpreads.length}>
        <div className="PartnerSchedule__general">
          {countrySpreads.map(({ country, limit }) => (
            <div className="PartnerSchedule__countrySpreads" key={country}>
              <span>{countryList[country.toUpperCase()]}</span>
              <span className="margin-right-50">{limit}</span>
            </div>
          ))}
        </div>
      </When>

      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  const renderActions = (value: Schedule) => (
    <Button icon className="PartnerSchedule__edit" onClick={() => hansleShowEditScheduleModal(value)}>
      <i className="fa fa-edit" />
    </Button>
  );

  return (
    <div className="PartnerSchedule">
      <Formik
        initialValues={getInitSchedule}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting, setFieldValue }) => (
          <Form>
            <div className="PartnerSchedule__header-container">
              <div className="PartnerSchedule__heading">{I18n.t('PARTNERS.SCHEDULE.TITLE')}</div>
              <If condition={dirty || isSubmitting}>
                <Button primary type="submit">
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </Button>
              </If>
            </div>

            <Table
              items={partnerSchedule}
              customClassNameRow={({ day }: Schedule) => (
                classNames({
                  'PartnerSchedule--is-disabled': !checkedDays[day],
                }))
              }
            >
              <Column
                header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.ACTIVATE')}
                render={value => renderActivate(value, setFieldValue)}
              />

              <Column
                header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.DAY')}
                render={renderDay}
              />

              <Column
                header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.WORKING_HOURS')}
                render={renderHours}
              />

              <Column
                header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.TOTAL_LEADS_LIMIT')}
                render={renderLimit}
              />

              <Column
                header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.COUNTRY_LIMIT')}
                render={renderCountry}
              />

              <Column render={renderActions} />
            </Table>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    partnerScheduleModal: PartnerScheduleModal,
  }),
)(PartnerSchedule);
