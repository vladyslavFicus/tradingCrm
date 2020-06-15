import React, { PureComponent, Fragment } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import PermissionContent from 'components/PermissionContent';
import Placeholder from 'components/Placeholder';
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
    const isLoading = get(partnersQuery, 'loading');

    return (
      <div className="PartnersList">
        <div className="PartnersList__header">
          <div className="PartnersList__header-left">
            <Placeholder
              ready={!isLoading}
              customPlaceholder={(
                <Fragment>
                  <TextRow className="PartnersList__placeholder-title" />
                  <TextRow className="PartnersList__placeholder-info" />
                </Fragment>
              )}
            >
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
            </Placeholder>
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
