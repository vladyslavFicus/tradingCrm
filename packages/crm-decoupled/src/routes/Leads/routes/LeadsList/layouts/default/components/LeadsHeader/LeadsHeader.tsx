import React from 'react';
import I18n from 'i18n-js';
import { QueryResult } from '@apollo/client';
import { Button } from 'components';
import { TableSelection } from 'types';
import Placeholder from 'components/Placeholder';
import { UncontrolledTooltip } from 'components';
import { MAX_QUERY_LEADS } from 'routes/Leads/routes/LeadsList/constants/leadsHeader';
import useLeadsHeader from 'routes/Leads/routes/LeadsList/hooks/useLeadsHeader';
import { LeadsListQuery } from 'routes/Leads/routes/LeadsList/graphql/__generated__/LeadsListQuery';
import './LeadsHeader.scss';

type Props = {
  select: TableSelection | null,
  leadsQuery: QueryResult<LeadsListQuery>,
};

const LeadsHeader = (_props: Props) => {
  const { leadsQuery } = _props;
  const { loading } = leadsQuery;

  const {
    totalElements,
    loadingTotalCount,
    totalCount,
    allowChangeAcquisition,
    allowUploadLeads,
    listCount,
    selectedCount,
    handleGetLeadsCount,
    handleOpenRepresentativeModal,
    handleOpenLeadsUploadModal,
  } = useLeadsHeader(_props);

  return (
    <div className="LeadsHeader">
      <div className="LeadsHeader__left">
        <Placeholder
          ready={!loading}
          rows={[{ width: 220, height: 20 }, { width: 220, height: 12 }]}
        >
          <Choose>
            <When condition={!!listCount}>
              <div>
                <div className="LeadsHeader__title">
                  <Choose>
                    <When condition={listCount === MAX_QUERY_LEADS && !totalCount}>
                      <>
                        <Placeholder
                          ready={!loadingTotalCount}
                          rows={[{ width: 75, height: 20 }]}
                        >
                          <span
                            className="LeadsHeader__active-text"
                            onClick={handleGetLeadsCount}
                            id="leadsTotalCount"
                          >
                            {`${listCount} +`}
                          </span>
                        </Placeholder>

                        <If condition={!loadingTotalCount}>
                          <UncontrolledTooltip
                            placement="bottom-start"
                            target="leadsTotalCount"
                            delay={{ show: 350, hide: 250 }}
                            fade={false}
                          >
                            {I18n.t('CLIENTS.TOTAL_COUNT_TOOLTIP')}
                          </UncontrolledTooltip>
                        </If>

                        &nbsp;{I18n.t('LEADS.LEADS_FOUND')}
                      </>
                    </When>

                    <When condition={listCount === MAX_QUERY_LEADS && !!totalCount}>
                      <b>{totalCount} </b> {I18n.t('LEADS.LEADS_FOUND')}
                    </When>

                    <Otherwise>
                      <b>{listCount} </b> {I18n.t('LEADS.LEADS_FOUND')}
                    </Otherwise>
                  </Choose>
                </div>

                <div className="LeadsHeader__selected">
                  <b>{selectedCount}</b> {I18n.t('LEADS.LEADS_SELECTED')}
                </div>
              </div>
            </When>

            <Otherwise>
              <div className="LeadsHeader__title">
                {I18n.t('LEADS.LEADS')}
              </div>
            </Otherwise>
          </Choose>
        </Placeholder>
      </div>

      <div className="LeadsHeader__right">
        <If condition={allowChangeAcquisition && totalElements !== 0 && selectedCount !== 0}>
          <div className="LeadsHeader__bulk">
            <div className="LeadsHeader__bulk-title">
              {I18n.t('LEADS.BULK_ACTIONS')}
            </div>

            <Button
              tertiary
              onClick={handleOpenRepresentativeModal}
              data-testid="LeadsHeader-bulkActionsSalesButton"
            >
              {I18n.t('COMMON.SALES')}
            </Button>
          </div>
        </If>

        <If condition={allowUploadLeads && selectedCount === 0}>
          <Button
            tertiary
            onClick={handleOpenLeadsUploadModal}
            data-testid="LeadsHeader-uploadLeadsButton"
          >
            {I18n.t('COMMON.UPLOAD')}
          </Button>
        </If>
      </div>
    </div>
  );
};

export default React.memo(LeadsHeader);
