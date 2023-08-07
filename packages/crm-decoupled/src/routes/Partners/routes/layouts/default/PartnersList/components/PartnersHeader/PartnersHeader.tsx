import React from 'react';
import I18n from 'i18n-js';
import { Button } from 'components';
import usePartnersHeader from 'routes/Partners/routes/hooks/usePartnersHeader';
import PartnersBulkActions from '../PartnersBulkActions/PartnersBulkActions';
import './PartnersHeader.scss';

type Props = {
  uuids: Array<string>,
  selected: number,
  totalElements: number,
  onRefetch: () => void,
  selectAll: boolean,
};

const PartnersHeader = (props: Props) => {
  const {
    uuids,
    selected,
    totalElements,
    onRefetch,
    selectAll,
  } = props;

  const {
    allowChangeAffiliates,
    allowCreatePartners,
    handleOpenCreatePartnerModal,
  } = usePartnersHeader();

  return (
    <div className="PartnersHeader">
      <div className="PartnersHeader__left">
        <div className="PartnersHeader__title">
          <strong>{totalElements} </strong>
          {I18n.t('COMMON.PARTNERS_FOUND')}
        </div>

        <div className="PartnersHeader__selected">
          <b>{selected}</b> {I18n.t('COMMON.PARTNERS_SELECTED')}
        </div>
      </div>

      <div className="PartnersHeader__right">
        <If condition={allowChangeAffiliates}>
          <If condition={!!selected}>
            <PartnersBulkActions onRefetch={onRefetch} uuids={uuids} selected={selected} selectAll={selectAll} />
          </If>
        </If>

        <If condition={allowCreatePartners}>
          <Button
            data-testid="PartnersHeader-createPartnerButton"
            onClick={handleOpenCreatePartnerModal}
            tertiary
          >
            {I18n.t('PARTNERS.CREATE_PARTNER_BUTTON')}
          </Button>
        </If>
      </div>
    </div>
  );
};

export default React.memo(PartnersHeader);
