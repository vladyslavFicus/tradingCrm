import React from 'react';
import I18n from 'i18n-js';
import { set, cloneDeep } from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import { Sort, State } from 'types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import Tabs from 'components/Tabs';
import { Column, Table } from 'components/Table';
import { PaymentSystemProvider } from '__generated__/types';
import { PSPTabs } from '../../constants';
import {
  PaymentSystemsProviderQueryVariables,
  usePaymentSystemsProviderQuery,
} from './graphql/__generated__/PaymentSystemsProviderQuery';
import { ReactComponent as FavoriteStarIcon } from './icons/favorites-star.svg';
import PSPFilter from './components/PSPFilter';
import { useDeletePaymentSystemsProviderMutation } from './graphql/__generated__/DeletePaymentSystemsProviderMutation';
import { useCreatePaymentSystemsProviderMutation } from './graphql/__generated__/CreatePaymentSystemsProviderMutation';
import './PSP.scss';

type PaymentSystemsProviderVariables = PaymentSystemsProviderQueryVariables['args'];

const PSP = () => {
  const { state } = useLocation<State<PaymentSystemsProviderVariables>>();

  const history = useHistory();

  const permission = usePermission();

  const updateFavorites = permission.allows(permissions.PAYMENT.UPDATE_PSP);

  // ===== Requests ===== //
  const [deletePaymentSystemsProvider] = useDeletePaymentSystemsProviderMutation();
  const [createPaymentSystemsProvider] = useCreatePaymentSystemsProviderMutation();

  const { data, fetchMore, loading, refetch, variables } = usePaymentSystemsProviderQuery({
    variables: {
      args: {
        ...state?.filters as PaymentSystemsProviderVariables,
        withFavouriteStatus: true,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    },
  });

  const { content = [], last, number = 0, totalElements = 0 } = data?.settings?.paymentSystemsProvider || {};

  // ===== Handlers ===== //
  const handleFavorite = async (paymentSystem: string, isFavourite?: boolean | null) => {
    if (isFavourite) {
      try {
        await deletePaymentSystemsProvider({
          variables: { paymentSystem },
        });

        await refetch();
      } catch (e) {
        // do nothing
      }
    } else {
      try {
        await createPaymentSystemsProvider({
          variables: { paymentSystem },
        });

        await refetch();
      } catch (e) {
        // do nothing
      }
    }
  };

  const renderColumnName = ({ paymentSystem }: PaymentSystemProvider) => (
    <div className="PSP__cell-name">
      {paymentSystem}
    </div>
  );

  const renderFavorite = ({ paymentSystem, isFavourite }: PaymentSystemProvider) => (
    <FavoriteStarIcon
      onClick={() => {
        if (updateFavorites) handleFavorite(paymentSystem, isFavourite);
      }}
      className={`
        PSP__favourite
        ${isFavourite ? 'PSP__favourite--active' : ''}
        ${!updateFavorites ? 'PSP__favourite--deactivated' : ''}
      `}
    />
  );

  const handlePageChanged = () => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables as PaymentSystemsProviderQueryVariables), 'page.from', number + 1),
      });
    }
  };

  const handleSort = (sorts: Sort[]) => {
    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  return (
    <div className="PSP">
      <Tabs items={PSPTabs} className="PSP__tabs" />

      <div className="PSP__header">
        <strong>{totalElements} </strong>

        {I18n.t('SETTINGS.PSP.HEADLINE')}
      </div>

      <PSPFilter onRefresh={refetch} />

      <div className="PSP">
        <Table
          stickyFromTop={125}
          items={content}
          loading={loading}
          onSort={handleSort}
          onMore={handlePageChanged}
          hasMore={!last}
          customClassNameRow="PSP__table-row"
        >
          <Column
            sortBy="paymentSystem"
            header={I18n.t('SETTINGS.PSP.GRID.PSP')}
            render={renderColumnName}
          />

          <Column
            header={I18n.t('SETTINGS.PSP.GRID.FAVOURITE')}
            render={renderFavorite}
          />
        </Table>
      </div>
    </div>
  );
};

export default React.memo(PSP);
