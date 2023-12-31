import React from 'react';
import I18n from 'i18n-js';
import { QueryResult } from '@apollo/client';
import { Types, Constants } from '@crm/common';
import { Button } from 'components';
import { AcquisitionStatusTypes__Enum as AcquisitionStatusTypes } from '__generated__/types';
import { ClientsListQuery } from 'routes/Clients/routes/ClientsList/graphql/__generated__/ClientsQuery';
import useClientsBulkActions from 'routes/Clients/routes/ClientsList/hooks/useClientsBulkActions';
import './ClientsBulkActions.scss';

type Props = {
  select: Types.TableSelection | null,
  selectedRowsLength: number,
  clientsQuery: QueryResult<ClientsListQuery>,
};

const ClientsBulkActions = (_props: Props) => {
  const {
    department,
    allowChangeAsquisitionStatus,
    handleTriggerRepModal,
    handleTriggerUpdateAcquisitionStatusModal,
  } = useClientsBulkActions(_props);

  return (
    <div className="ClientsBulkActions">
      <div className="ClientsBulkActions__title">
        {I18n.t('CLIENTS.BULK_ACTIONS')}
      </div>

      <If condition={allowChangeAsquisitionStatus}>
        <If condition={department !== Constants.departments.RETENTION}>
          <Button
            tertiary
            className="ClientsBulkActions__button"
            data-testid="ClientsBulkActions-salesButton"
            onClick={handleTriggerRepModal(AcquisitionStatusTypes.SALES)}
          >
            {I18n.t('COMMON.SALES')}
          </Button>
        </If>

        <If condition={department !== Constants.departments.SALES}>
          <Button
            tertiary
            className="ClientsBulkActions__button"
            data-testid="ClientsBulkActions-retentionButton"
            onClick={handleTriggerRepModal(AcquisitionStatusTypes.RETENTION)}
          >
            {I18n.t('COMMON.RETENTION')}
          </Button>
        </If>

        <Button
          tertiary
          className="ClientsBulkActions__button"
          data-testid="ClientsBulkActions-moveButton"
          onClick={handleTriggerUpdateAcquisitionStatusModal}
        >
          {I18n.t('COMMON.MOVE')}
        </Button>
      </If>
    </div>
  );
};

export default React.memo(ClientsBulkActions);
