import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { useHistory, useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { State, Sort, Modal, LevelType, Notify } from 'types';
import { withModals, withNotifications } from 'hoc';
import permissions from 'config/permissions';
import { Table, Column } from 'components/Table';
import PermissionContent from 'components/PermissionContent';
import { Button, EditButton, TrashButton } from 'components/UI';
import Tabs from 'components/Tabs';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { usePermission } from 'providers/PermissionsProvider';
import { tradingEngineTabs } from 'routes/TE/constants';
import HolidaysFilter from './components/HolidaysFilter';
import { useHolidaysQuery, HolidaysQuery, HolidaysQueryVariables } from './graphql/__generated__/HolidaysQuery';
import { useDeleteHolidayMutation } from './graphql/__generated__/DeleteHolidayMutation';
import './HolidaysList.scss';

type Holiday = ExtractApolloTypeFromPageable<HolidaysQuery['tradingEngine']['holidays']>;

interface ConfirmationModalProps {
  onSubmit: () => void,
  modalTitle: string,
  actionText: string,
  submitButtonLabel: string,
}

interface Props {
  notify: Notify,
  modals: {
    confirmationModal: Modal<ConfirmationModalProps>,
  },
}

const Holidays = (props: Props) => {
  const { modals: { confirmationModal }, notify } = props;

  const history = useHistory();
  const { state } = useLocation<State<HolidaysQueryVariables['args']>>();

  const permission = usePermission();

  const [deleteHoliday] = useDeleteHolidayMutation();

  const holidaysQuery = useHolidaysQuery({
    variables: {
      args: {
        ...state?.filters,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    },
  });

  const { content = [], last = true, totalElements } = holidaysQuery.data?.tradingEngine.holidays || {};

  const handlePageChanged = () => {
    const { data, variables, fetchMore } = holidaysQuery;

    const page = data?.tradingEngine.holidays.number || 0;

    fetchMore({
      variables: set(cloneDeep(variables as HolidaysQueryVariables), 'args.page.from', page + 1),
    });
  };

  const handleSort = (sorts: Sort[]) => {
    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  const handleCreateClick = () => {
    history.push('/trading-engine/holidays/new');
  };

  const handleHolidayEditClick = (holiday: Holiday) => {
    history.push(`/trading-engine/holidays/${holiday.id}`);
  };

  const handleDeleteHoliday = async (id: string) => {
    try {
      await deleteHoliday({ variables: { id } });

      await holidaysQuery.refetch();
      confirmationModal.hide();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.HOLIDAYS.NOTIFICATION.DELETE.SUCCESS'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('TRADING_ENGINE.HOLIDAYS.NOTIFICATION.DELETE.FAILED'),
      });
    }
  };

  const handleHolidayDeleteClick = (holiday: Holiday) => {
    confirmationModal.show({
      onSubmit: () => handleDeleteHoliday(holiday.id),
      modalTitle: I18n.t('TRADING_ENGINE.HOLIDAYS.CONFIRMATION.DELETE.TITLE'),
      actionText: I18n.t('TRADING_ENGINE.HOLIDAYS.CONFIRMATION.DELETE.DESCRIPTION', { date: holiday.date }),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  return (
    <div className="HolidaysList">
      <Tabs items={tradingEngineTabs} />

      <div className="HolidaysList__header">
        <div>
          <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.HOLIDAYS.HEADLINE')}
        </div>

        <PermissionContent permissions={permissions.WE_TRADING.HOLIDAYS_CREATE}>
          <div>
            <Button
              onClick={handleCreateClick}
              tertiary
              small
            >
              {I18n.t('TRADING_ENGINE.HOLIDAYS.NEW_HOLIDAY')}
            </Button>
          </div>
        </PermissionContent>
      </div>

      <HolidaysFilter onRefresh={holidaysQuery.refetch} />

      <Table
        items={content}
        loading={holidaysQuery.loading}
        hasMore={!last}
        sorts={state?.sorts}
        onSort={handleSort}
        onMore={handlePageChanged}
        stickyFromTop={127}
      >
        <Column
          sortBy="date"
          header={I18n.t('TRADING_ENGINE.HOLIDAYS.GRID.DAY')}
          render={({ date }: Holiday) => (
            <div className="HolidaysList__cell-value">
              {moment(date).format('YYYY.MM.DD')}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.HOLIDAYS.GRID.FROM')}
          render={({ timeRange: { from } }: Holiday) => (
            <div className="HolidaysList__cell-value">
              {moment(from, 'HH:mm:ss').format('HH:mm')}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.HOLIDAYS.GRID.TO')}
          render={({ timeRange: { to } }: Holiday) => (
            <div className="HolidaysList__cell-value">
              {moment(to, 'HH:mm:ss').format('HH:mm')}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.HOLIDAYS.GRID.DESCRIPTION')}
          render={({ description }: Holiday) => (
            <div className="HolidaysList__cell-value">
              {description}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.HOLIDAYS.GRID.SYMBOLS')}
          render={({ symbols }: Holiday) => (
            <Choose>
              <When condition={symbols.length > 0}>
                <div className="HolidaysList__cell-value">
                  {symbols.join(', ')}
                </div>
              </When>
              <Otherwise>
                <span>&mdash;</span>
              </Otherwise>
            </Choose>
          )}
        />

        <If condition={
          permission.allows(permissions.WE_TRADING.HOLIDAYS_EDIT)
          || permission.allows(permissions.WE_TRADING.HOLIDAYS_DELETE)}
        >
          <Column
            width={120}
            header={I18n.t('TRADING_ENGINE.HOLIDAYS.GRID.ACTIONS')}
            render={(holiday: Holiday) => (
              <>
                <PermissionContent permissions={permissions.WE_TRADING.HOLIDAYS_EDIT}>
                  <EditButton
                    onClick={() => handleHolidayEditClick(holiday)}
                    className="HolidaysList__edit-button"
                  />
                </PermissionContent>
                <PermissionContent permissions={permissions.WE_TRADING.HOLIDAYS_DELETE}>
                  <TrashButton onClick={() => handleHolidayDeleteClick(holiday)} />
                </PermissionContent>
              </>
            )}
          />
        </If>
      </Table>
    </div>
  );
};

export default compose(
  React.memo,
  withNotifications,
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
)(Holidays);
