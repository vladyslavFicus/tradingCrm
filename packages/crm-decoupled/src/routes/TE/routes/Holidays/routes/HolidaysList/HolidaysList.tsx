import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { State, Sort } from 'types';
import permissions from 'config/permissions';
import { Table, Column } from 'components/Table';
import { Button, EditButton, TrashButton } from 'components/Buttons';
import Tabs from 'components/Tabs';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import { usePermission } from 'providers/PermissionsProvider';
import useHandlePageChanged from 'hooks/useHandlePageChanged';
import { tradingEngineTabs } from 'routes/TE/constants';
import HolidaysFilter from './components/HolidaysFilter';
import { useHolidaysQuery, HolidaysQuery, HolidaysQueryVariables } from './graphql/__generated__/HolidaysQuery';
import { useDeleteHolidayMutation } from './graphql/__generated__/DeleteHolidayMutation';
import './HolidaysList.scss';

type Holiday = ExtractApolloTypeFromPageable<HolidaysQuery['tradingEngine']['holidays']>;

const Holidays = () => {
  const navigate = useNavigate();
  const state = useLocation().state as State<HolidaysQueryVariables['args']>;

  const permission = usePermission();

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

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

  const { data } = holidaysQuery;
  const { content = [], last = true, totalElements } = data?.tradingEngine.holidays || {};
  const page = data?.tradingEngine.holidays.number || 0;
  const handlePageChanged = useHandlePageChanged({
    query: holidaysQuery,
    page,
    path: 'page.from',
  });

  const handleSort = (sorts: Sort[]) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  };

  const handleCreateClick = () => {
    navigate('/trading-engine/holidays/new');
  };

  const handleHolidayEditClick = (holiday: Holiday) => {
    navigate(`/trading-engine/holidays/${holiday.id}`);
  };

  const handleDeleteHoliday = async (id: string) => {
    try {
      await deleteHoliday({ variables: { id } });

      await holidaysQuery.refetch();
      confirmActionModal.hide();

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
    confirmActionModal.show({
      onSubmit: () => handleDeleteHoliday(holiday.id),
      modalTitle: I18n.t('TRADING_ENGINE.HOLIDAYS.CONFIRMATION.DELETE.TITLE'),
      actionText: I18n.t('TRADING_ENGINE.HOLIDAYS.CONFIRMATION.DELETE.DESCRIPTION', { date: holiday.date }),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  const allowsHolidaysEdit = permission.allows(permissions.WE_TRADING.HOLIDAYS_EDIT);
  const allowsHolidaysDelete = permission.allows(permissions.WE_TRADING.HOLIDAYS_DELETE);

  return (
    <div className="HolidaysList">
      <Tabs items={tradingEngineTabs} />

      <div className="HolidaysList__header">
        <div>
          <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.HOLIDAYS.HEADLINE')}
        </div>

        <If condition={permission.allows(permissions.WE_TRADING.HOLIDAYS_CREATE)}>
          <div>
            <Button
              data-testid="Holidays-newHolidayButton"
              onClick={handleCreateClick}
              tertiary
              small
            >
              {I18n.t('TRADING_ENGINE.HOLIDAYS.NEW_HOLIDAY')}
            </Button>
          </div>
        </If>
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
          allowsHolidaysEdit
          || allowsHolidaysDelete}
        >
          <Column
            width={120}
            header={I18n.t('TRADING_ENGINE.HOLIDAYS.GRID.ACTIONS')}
            render={(holiday: Holiday) => (
              <>
                <If condition={allowsHolidaysEdit}>
                  <EditButton
                    onClick={() => handleHolidayEditClick(holiday)}
                    className="HolidaysList__edit-button"
                    data-testid="Holidays-editButton"
                  />
                </If>
                <If condition={allowsHolidaysDelete}>
                  <TrashButton
                    data-testid="Holidays-trashButton"
                    onClick={() => handleHolidayDeleteClick(holiday)}
                  />
                </If>
              </>
            )}
          />
        </If>
      </Table>
    </div>
  );
};

export default React.memo(Holidays);
