import React from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Button } from 'components/Buttons';
import { actionStatus, statusActions } from 'routes/Partners/constants';
import usePartnersBulkActions from 'routes/Partners/routes/hooks/usePartnersBulkActions';
import './PartnersBulkActions.scss';

type Props = {
  uuids: Array<string>,
  selected: number,
  selectAll: boolean,
  onRefetch: () => void,
};

const PartnersBulkActions = (props: Props) => {
  const {
    uuids,
    selectAll,
    selected,
    onRefetch,
  } = props;

  const {
    allowChangeAffiliatesStatuses,
    allowChangeAffiliatesCountries,
    updateStatuses,
    handleAddRestrictedCountriesModal,
    handleDeleteRestrictedCountriesModal,
  } = usePartnersBulkActions({
    uuids,
    selectAll,
    selected,
    onRefetch,
  });

  return (
    <div className="PartnersBulkActions">
      <div className="PartnersBulkActions__title">
        {I18n.t('PARTNERS.BULK_ACTIONS')}
      </div>

      <If condition={allowChangeAffiliatesStatuses}>
        {statusActions
          .map(({ label, reasons, action }) => (
            <Button
              key={action}
              tertiary
              className={classNames('PartnersBulkActions__button', {
                'PartnersBulkActions__button--success': action === actionStatus.ACTIVE,
                'PartnersBulkActions__button--danger': action === actionStatus.CLOSED,
              })}
              data-testid="PartnersBulkActions-updateStatusButton"
              onClick={() => updateStatuses(reasons, action)}
            >
              {I18n.t(label)}
            </Button>
          ))
        }
      </If>

      <If condition={allowChangeAffiliatesCountries}>
        <Button
          className="PartnersBulkActions__button PartnersBulkActions__button--danger"
          data-testid="PartnersBulkActions-allowCountriesButton"
          tertiary
          onClick={handleAddRestrictedCountriesModal}
        >
          {I18n.t('PARTNERS.RESTRICT_COUNTRIES')}
        </Button>

        <Button
          tertiary
          className="PartnersBulkActions__button PartnersBulkActions__button--success"
          data-testid="PartnersBulkActions-restrictCountriesButton"
          onClick={handleDeleteRestrictedCountriesModal}
        >
          {I18n.t('PARTNERS.ALLOW_COUNTRIES')}
        </Button>
      </If>
    </div>
  );
};

export default React.memo(PartnersBulkActions);
