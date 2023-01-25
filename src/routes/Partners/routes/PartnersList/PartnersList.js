import React, { PureComponent } from 'react';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import CreatePartnerModal from 'modals/CreatePartnerModal';
import PartnersHeader from './components/PartnersHeader/PartnersHeader';
import PartnersGridFilter from './components/PartnersGridFilter';
import PartnersGrid from './components/PartnersGrid';
import PartnersQuery from './graphql/PartnersQuery';
import './PartnersList.scss';

class PartnersList extends PureComponent {
  static propTypes = {
    partnersQuery: PropTypes.query({
      partners: PropTypes.pageable(PropTypes.partner),
    }).isRequired,
    modals: PropTypes.shape({
      createPartnerModal: PropTypes.modalType,
    }).isRequired,
  };

  handleOpenCreatePartnerModal = () => {
    this.props.modals.createPartnerModal.show();
  };

  state = {
    select: null,
  };

  handleSelect = (select) => {
    this.setState({ select });
  };

  render() {
    const { partnersQuery } = this.props;
    const { select } = this.state;
    const partners = partnersQuery?.data?.partners;

    const partnersUuid = partners?.content?.map(({ uuid }) => uuid) || [];
    const selectedPartnersUuid = (select?.touched || []).map(item => partnersUuid[item]);

    return (
      <div className="PartnersList">
        <PartnersHeader
          totalElements={partners?.totalElements}
          selected={select?.selected || 0}
          onRefetch={partnersQuery.refetch}
          partnersUuids={selectedPartnersUuid}
        />

        <PartnersGridFilter handleRefetch={partnersQuery.refetch} />

        <PartnersGrid onSelect={this.handleSelect} partnersQuery={partnersQuery} />
      </div>
    );
  }
}

export default compose(
  withModals({ createPartnerModal: CreatePartnerModal }),
  withRequests({ partnersQuery: PartnersQuery }),
)(PartnersList);
