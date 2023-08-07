import React from 'react';
import I18n from 'i18n-js';
import { TableSelection } from 'types';
import { IpWhitelistAddress } from '__generated__/types';
import { Button } from 'components';
import useIpWhitelistHeader from 'routes/IpWhitelist/hooks/useIpWhitelistHeader';
import './IpWhitelistHeader.scss';

type Props = {
  content: Array<IpWhitelistAddress>,
  totalElements: number,
  selected: TableSelection | null,
  onRefetch: () => void,
};

const IpWhitelistHeader = (_props: Props) => {
  const {
    totalElements,
    selected,
    onRefetch,
  } = _props;

  const {
    allowAddIp,
    allowDeleteIp,
    createIpWhiteListModal,
    handleOpenBulkDeleteModal,
  } = useIpWhitelistHeader(_props);

  return (
    <div className="IpWhitelistHeader">
      <div className="IpWhitelistHeader__headline">
        <strong>{totalElements} </strong>

        {I18n.t('IP_WHITELIST.GRID.HEADLINE')}
      </div>

      <If condition={allowAddIp}>
        <div className="IpWhitelistHeader__actions">
          <Button
            secondary
            className="IpWhitelistHeader__actions-button"
            data-testid="IpWhitelistHeader-addIpButton"
            onClick={() => createIpWhiteListModal.show({ onSuccess: onRefetch })}
            type="button"
          >
            {I18n.t('IP_WHITELIST.GRID.ADD_IP')}
          </Button>

          <If condition={!!selected?.selected && allowDeleteIp}>
            <Button
              danger
              className="IpWhitelistHeader__actions-button"
              data-testid="IpWhitelistHeader-deleteIpsButton"
              onClick={handleOpenBulkDeleteModal}
              type="button"
            >
              {I18n.t('IP_WHITELIST.GRID.DELETE_IPS')}
            </Button>
          </If>
        </div>
      </If>
    </div>
  );
};

export default React.memo(IpWhitelistHeader);
