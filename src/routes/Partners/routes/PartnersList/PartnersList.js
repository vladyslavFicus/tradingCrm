import React, { PureComponent, Fragment } from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { withRequests } from 'apollo';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { withModals, withNotifications } from 'hoc';

// will be removed with AddPartnerModal refactoring
import { authoritiesOptionsQuery } from 'graphql/queries/auth';
import { createPartner } from 'graphql/mutations/partners';

import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import PermissionContent from 'components/PermissionContent';
import Placeholder from 'components/Placeholder';
import { Button } from 'components/UI';
import CreatePartnerModalContainer from './components/CreatePartnerModal';
import PartnersGridFilter from './components/PartnersGridFilter';
import PartnersGrid from './components/PartnersGrid';
import getPartnersQuery from './graphql/getPartnersQuery';
import './PartnersList.scss';

class PartnersList extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
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
    notify: PropTypes.func.isRequired,
    createNewPartner: PropTypes.func.isRequired,
  };

  static defaultProps = {
    partnersQueryResult: {},
  };

  handleFiltersSubmit = (filters = {}) => {
    this.props.history.replace({ query: { filters } });
  };

  handleFilterReset = () => {
    this.props.history.replace({ query: { filters: {} } });
  };

  handlePageChanged = () => {
    const {
      partnersQueryResult,
      partnersQueryResult: {
        loadMore,
        loading,
      },
    } = this.props;

    const partnersDataPage = get(partnersQueryResult, 'data.partners.data.page') || {};

    if (!loading) {
      loadMore(partnersDataPage);
    }
  };

  // will be rewriten with AddPartnerModal refactoring
  handleCreateNewPartner = async (data) => {
    const {
      modals: { createPartnerModal },
      createNewPartner,
      notify,
      history,
    } = this.props;

    const newPartnerData = await createNewPartner({
      variables: data,
    });

    const serverError = get(newPartnerData, 'data.partner.createPartner.error.error') || null;
    const partnerUuid = get(newPartnerData, 'data.partner.createPartner.data.uuid') || null;

    if (serverError) {
      if (serverError === 'error.entity.already.exists') {
        notify({
          level: 'error',
          title: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EMAIL.TITLE'),
          message: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EMAIL.MESSAGE'),
        });
      } else if (serverError === 'error.affiliate.externalId.already.exists') {
        notify({
          level: 'error',
          title: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EXTERNAL_ID.TITLE'),
          message: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EXTERNAL_ID.MESSAGE'),
        });
      } else {
        notify({
          level: 'error',
          title: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EXTERNAL_ID.TITLE'),
          message: I18n.t('COMMON.SOMETHING_WRONG'),
        });
      }

      return;
    }

    notify({
      level: 'success',
      title: I18n.t('PARTNERS.NOTIFICATIONS.CREATE_PARTNER_SUCCESS.TITLE'),
      message: I18n.t('PARTNERS.NOTIFICATIONS.CREATE_PARTNER_SUCCESS.MESSAGE'),
    });

    createPartnerModal.hide();

    if (partnerUuid) {
      history.push(`/partners/${partnerUuid}/profile`);
    }
  };

  // will be rewriten with AddPartnerModal refactoring
  handleOpenCreateModal = async () => {
    const { modals, notify, client } = this.props;

    const {
      data: {
        authoritiesOptions: {
          data: {
            post: {
              departmentRole,
            },
          },
          error,
        },
      },
    } = await client.query({ query: authoritiesOptionsQuery });

    if (!error) {
      delete departmentRole.PLAYER;
      delete departmentRole.AFFILIATE_PARTNER;

      const [department] = Object.keys(departmentRole);

      const initialValues = {
        department,
        role: department ? departmentRole[department][0] : null,
        sendMail: true,
      };

      modals.createPartnerModal.show({
        onSubmit: this.handleCreateNewPartner,
        initialValues,
        departmentsRoles: departmentRole || {},
      });
    } else {
      notify({
        level: 'error',
        title: I18n.t('PARTNERS.NOTIFICATIONS.GET_AUTHORITIES_ERROR.TITLE'),
        message: I18n.t('PARTNERS.NOTIFICATIONS.GET_AUTHORITIES_ERROR.MESSAGE'),
      });
    }
  };

  render() {
    const { partnersQueryResult } = this.props;

    const partnersData = get(partnersQueryResult, 'data.partners.data') || {};
    const isLoading = get(partnersQueryResult, 'loading') || false;
    const isLastPage = get(partnersQueryResult, 'last') || true;

    return (
      <div className="PartnersList">
        <div className="PartnersList__header">
          {/* Partners header title */}
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

          {/* Partners header action buttons */}
          <PermissionContent permissions={permissions.PARTNERS.CREATE}>
            <div className="PartnersList__header-right">
              <Button
                onClick={this.handleOpenCreateModal}
                commonOutline
              >
                {I18n.t('PARTNERS.CREATE_PARTNER_BUTTON')}
              </Button>
            </div>
          </PermissionContent>
        </div>

        <PartnersGridFilter
          onSubmit={this.handleFiltersSubmit}
          onReset={this.handleFilterReset}
        />

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
  withApollo,
  withNotifications,
  withModals({
    createPartnerModal: CreatePartnerModalContainer, // will be rewriten with AddPartnerModal refactoring
  }),
  withRequests({
    partnersQueryResult: getPartnersQuery,
  }),

  // will be removed with AddPartnerModal refactoring
  graphql(createPartner, {
    name: 'createNewPartner',
  }),
)(PartnersList);
