import React, { PureComponent, Fragment } from 'react';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { withModals } from 'hoc';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import PermissionContent from 'components/PermissionContent';
import Placeholder from 'components/Placeholder';
import { Button } from 'components/UI';
import CreatePartnerModal from './components/CreatePartnerModal';
import PartnersGridFilter from './components/PartnersGridFilter';
import PartnersGrid from './components/PartnersGrid';
import getPartnersQuery from './graphql/getPartnersQuery';
import './PartnersList.scss';

class PartnersList extends PureComponent {
  static propTypes = {
    partnersQueryResult: PropTypes.shape({
      data: PropTypes.shape({
        partners: PropTypes.shape({
          data: PropTypes.pageable(PropTypes.partner),
        }),
      }),
    }),
    modals: PropTypes.shape({
      createPartnerModal: PropTypes.modalType,
    }).isRequired,
  };

  static defaultProps = {
    partnersQueryResult: {},
  };

  handlePageChanged = () => {
    const {
      partnersQueryResult,
      partnersQueryResult: {
        loadMore,
        loading,
      },
    } = this.props;

    const partnersDataPage = get(partnersQueryResult, 'data.partners.data.page') || {}; // ?

    if (!loading) {
      loadMore(partnersDataPage);
    }
  };

  handleOpenCreatePartnerModal = () => {
    this.props.modals.createPartnerModal.show();
  };

  render() {
    const { partnersQueryResult } = this.props;

    const partnersData = get(partnersQueryResult, 'data.partners.data') || {};
    const isLoading = get(partnersQueryResult, 'loading') || false;
    const isLastPage = get(partnersQueryResult, 'last') || true;

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
                <When condition={!!partnersData.totalElements}>
                  <div className="PartnersList__total">
                    <strong>{partnersData.totalElements} </strong>
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

        <PartnersGrid
          onPageChange={this.handlePageChanged}
          partners={partnersData.content || []}
          isLastPage={isLastPage}
          isLoading={isLoading}
        />
      </div>
    );
  }
}

export default compose(
  withModals({ createPartnerModal: CreatePartnerModal }),
  withRequests({ partnersQueryResult: getPartnersQuery }),
)(PartnersList);
