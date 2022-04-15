import React from 'react';
import I18n from 'i18n-js';
import { useLocation } from 'react-router-dom';
import { State } from 'types';
import { getBrand } from 'config';
import { AcquisitionStatusTypes__Enum as AcquisitionStatusTypes } from '__generated__/types';
import { salesStatuses } from 'constants/salesStatuses';
import { retentionStatuses } from 'constants/retentionStatuses';
import { Table, Column } from 'components/Table';
import AcquisitionStatusesFilter from './components/AcquisitionStatusesFilter';
import {
  useAcquisitionStatusesQuery,
  AcquisitionStatusesQuery,
  AcquisitionStatusesQueryVariables,
} from './graphql/__generated__/AcquisitionStatusesQuery';
import './AcquisitionStatuses.scss';

type AcquisitionStatus = ExtractApolloTypeFromArray<AcquisitionStatusesQuery['settings']['acquisitionStatuses']>;

const AcquisitionStatuses = () => {
  const { state } = useLocation<State<AcquisitionStatusesQueryVariables['args']>>();

  const acquisitionStatusesQuery = useAcquisitionStatusesQuery({
    variables: {
      brandId: getBrand().id,
      args: {
        ...state?.filters,
      },
    },
  });

  const acquisitionStatuses = acquisitionStatusesQuery.data?.settings.acquisitionStatuses || [];

  return (
    <div className="AcquisitionStatuses">
      <div className="AcquisitionStatuses__header">
        <span>
          <strong>{!acquisitionStatusesQuery.loading && acquisitionStatuses.length}</strong>
          &nbsp;{I18n.t('SETTINGS.ACQUISITION_STATUSES.HEADLINE')}
        </span>
      </div>

      <AcquisitionStatusesFilter onRefresh={acquisitionStatusesQuery.refetch} />

      <div className="AcquisitionStatuses">
        <Table
          stickyFromTop={125}
          items={acquisitionStatuses}
          loading={acquisitionStatusesQuery.loading}
        >
          <Column
            header={I18n.t('SETTINGS.ACQUISITION_STATUSES.GRID.STATUS_NAME')}
            render={({ type, status }: AcquisitionStatus) => (
              <div className="AcquisitionStatuses__text-primary">
                <If condition={type === AcquisitionStatusTypes.SALES}>
                  {I18n.t(salesStatuses[status])}
                </If>
                <If condition={type === AcquisitionStatusTypes.RETENTION}>
                  {I18n.t(retentionStatuses[status])}
                </If>
              </div>
            )}
          />
          <Column
            header={I18n.t('SETTINGS.ACQUISITION_STATUSES.GRID.ACQUISITION')}
            render={({ type }: AcquisitionStatus) => (
              <div className="AcquisitionStatuses__text-primary">
                {I18n.t(`SETTINGS.ACQUISITION_STATUSES.TYPES.${type}`)}
              </div>
            )}
          />
        </Table>
      </div>
    </div>
  );
};

export default React.memo(AcquisitionStatuses);
