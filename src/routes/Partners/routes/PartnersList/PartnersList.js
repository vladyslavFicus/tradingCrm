import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import PermissionContent from 'components/PermissionContent';
import { Button } from 'components/UI';
import CreatePartnerModal from './components/CreatePartnerModal';
import PartnersGridFilter from './components/PartnersGridFilter';
import PartnersGrid from './components/PartnersGrid';
import PartnersQuery from './graphql/PartnersQuery';
import './PartnersList.scss';

class PartnersList extends PureComponent {
  static propTypes = {
    partnersQuery: PropTypes.query({
      partners: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.partner),
      }),
    }).isRequired,
    modals: PropTypes.shape({
      createPartnerModal: PropTypes.modalType,
    }).isRequired,
  };

  handleOpenCreatePartnerModal = () => {
    this.props.modals.createPartnerModal.show();
  };

  render() {
    const { partnersQuery } = this.props;

    const totalElements = get(partnersQuery, 'data.partners.data.totalElements');

    return (
      <div className="PartnersList">
        <div className="PartnersList__header">
          <div className="PartnersList__header-left">
            <Choose>
              <When condition={totalElements}>
                <div className="PartnersList__total">
                  <strong>{totalElements} </strong>
                  {I18n.t('COMMON.PARTNERS_FOUND')}
                </div>
              </When>
              <Otherwise>
                <div className="PartnersList__total">{I18n.t('PARTNERS.HEADING')}</div>
              </Otherwise>
            </Choose>
          </div>
          <PermissionContent permissions={permissions.PARTNERS.CREATE}>
            <div className="PartnersList__header-right">
              <Button
                onClick={this.handleOpenCreatePartnerModal}
                commonOutline
              >
                {I18n.t('PARTNERS.CREATE_PARTNER_BUTTON')}
              </Button>
            </div>
          </PermissionContent>
        </div>
        <PartnersGridFilter />
        <PartnersGrid partnersQuery={partnersQuery} />
      </div>
    );
  }
}

export default compose(
  withModals({ createPartnerModal: CreatePartnerModal }),
  withRequests({ partnersQuery: PartnersQuery }),
)(PartnersList);
