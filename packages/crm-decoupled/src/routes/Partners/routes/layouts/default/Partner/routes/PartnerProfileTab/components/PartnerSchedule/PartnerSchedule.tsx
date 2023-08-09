import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import classNames from 'classnames';
import { Utils } from '@crm/common';
import { Button } from 'components';
import { SetFieldValue } from 'types/formik';
import { Partner, Partner__Schedule as Schedule } from '__generated__/types';
import { Table, Column } from 'components/Table';
import { FormikCheckbox } from 'components/Formik';
import usePartnerSchedule from 'routes/Partners/routes/hooks/usePartnerSchedule';
import './PartnerSchedule.scss';

type ScheduleDays = Record<string, boolean>;

type Props = {
  partner: Partner,
  onRefetch: () => void,
};

const PartnerSchedule = (props: Props) => {
  const {
    partner,
    onRefetch,
  } = props;

  const {
    getInitSchedule,
    partnerSchedule,
    checkedDays,
    handleSubmit,
    hansleShowEditScheduleModal,
    handleChangeActivate,
  } = usePartnerSchedule({ partner, onRefetch });

  // ===== Renders ===== //
  const renderActivate = (value: Schedule, setFieldValue: SetFieldValue<ScheduleDays>) => (
    <Field
      name={value.day}
      data-testid={`PartnerSchedule-${value.day}Button`}
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
              <span>{Utils.countryList[country.toUpperCase()]}</span>
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
    <Button
      icon
      className="PartnerSchedule__edit"
      data-testid="PartnerSchedule-editButton"
      onClick={() => hansleShowEditScheduleModal(value)}
    >
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
                <Button
                  primary
                  type="submit"
                  data-testid="PartnerSchedule-saveChangesButton"
                >
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

export default React.memo(PartnerSchedule);
