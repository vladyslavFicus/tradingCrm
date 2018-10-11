import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import OfficesGridFilter from './OfficesGridFilter';
import history from '../../../../../router/history';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import Placeholder from '../../../../../components/Placeholder';
import Uuid from '../../../../../components/Uuid';
import CountryLabelWithFlag from '../../../../../components/CountryLabelWithFlag';

class List extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    createOffice: PropTypes.func.isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({
        filters: PropTypes.object,
      }),
    }).isRequired,
    officeManagers: PropTypes.shape({
      hierarchy: PropTypes.shape({
        hierarchyUsersByType: PropTypes.shape({
          data: PropTypes.shape({
            BRAND_ADMIN: PropTypes.arrayOf(PropTypes.userHierarchyType),
            COMPANY_ADMIN: PropTypes.arrayOf(PropTypes.userHierarchyType),
          }),
          error: PropTypes.object,
        }),
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    modals: PropTypes.shape({
      officeModal: PropTypes.modalType,
      infoModal: PropTypes.modalType,
    }).isRequired,
    countries: PropTypes.object.isRequired,
    auth: PropTypes.shape({
      isAdministration: PropTypes.bool.isRequired,
      operatorId: PropTypes.string.isRequired,
    }).isRequired,
    offices: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      refetch: PropTypes.func.isRequired,
      hierarchy: PropTypes.shape({
        branchHierarchy: PropTypes.shape({
          error: PropTypes.object,
          data: PropTypes.arrayOf(PropTypes.object),
        }).isRequired,
      }),
    }).isRequired,
  };

  componentWillUnmount() {
    this.handleFilterReset();
  }

  handleFiltersChanged = (filters = {}) => history.replace({ query: { filters } });

  handleFilterReset = () => history.replace({ query: { filters: {} } });

  handleOfficeClick = ({ office: { uuid } }) => {
    history.push(`/offices/${uuid}`);
  };

  triggerOfficeModal = () => {
    const {
      modals: { officeModal },
      officeManagers: { hierarchy: { hierarchyUsersByType: { data: { COMPANY_ADMIN = [], BRAND_ADMIN = [] } } } },
    } = this.props;

    officeModal.show({
      onSubmit: values => this.handleAddOffice(values),
      officeManagers: [...(COMPANY_ADMIN || []), ...(BRAND_ADMIN || [])],
    });
  }

  handleAddOffice = async (variables) => {
    const {
      createOffice,
      offices: { refetch },
      modals: { officeModal, infoModal },
      auth: { operatorId },
    } = this.props;

    const { data: { hierarchy: { createOffice: { data, error } } } } = await createOffice(
      {
        variables: {
          operatorId,
          ...variables,
        },
      },
    );

    refetch();
    officeModal.hide();
    infoModal.show({
      header: I18n.t('HIERARCHY.INFO_MODAL.OFFICE_BODY'),
      status: error.length === 0
        ? I18n.t('COMMON.SUCCESS')
        : I18n.t('COMMON.FAIL'),
      data,
      error,
    });
  };

  renderOffice = ({ office: { name, uuid } }) => (
    <Fragment>
      <div className="font-weight-700">
        {name}
      </div>
      <div className="font-size-11">
        <Uuid uuid={uuid} uuidPrefix="OF" />
      </div>
    </Fragment>
  );

  renderCountry = ({ office: { country } }) => (
    <Choose>
      <When condition={country}>
        <CountryLabelWithFlag
          code={country}
          height="14"
        />
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  render() {
    const {
      locale,
      offices: {
        loading,
        hierarchy: offices,
      },
      location: { query },
      countries,
      officeManagers: { hierarchy, loading: officeManagersLoading },
      auth: { isAdministration },
    } = this.props;

    const entities = get(offices, 'branchHierarchy.data') || [];
    const error = get(offices, 'branchHierarchy.error');
    const officeManagersError = get(hierarchy, 'hierarchyUsersByType.error');
    const filters = get(query, 'filters', {});

    const allowActions = Object
      .keys(filters)
      .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            ready={!loading && !!offices}
            className={null}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '220px', height: '12px' }} />
              </div>
            )}
          >
            <span className="font-size-20">
              {I18n.t('OFFICES.OFFICES')}
            </span>
          </Placeholder>
          <If condition={isAdministration}>
            <div className="ml-auto">
              <button
                className="btn btn-default-outline"
                onClick={this.triggerOfficeModal}
                disabled={error || officeManagersLoading || officeManagersError}
                type="button"
              >
                {I18n.t('OFFICES.ADD_OFFICE')}
              </button>
            </div>
          </If>
        </div>

        <OfficesGridFilter
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions || error}
          countries={countries}
        />

        <div className="card-body">
          <GridView
            dataSource={entities}
            last
            locale={locale}
            showNoResults={!loading && entities.length === 0}
            onRowClick={this.handleOfficeClick}
          >
            <GridViewColumn
              name="office"
              header={I18n.t('OFFICES.GRID_HEADER.OFFICE')}
              render={this.renderOffice}
            />
            <GridViewColumn
              name="country"
              header={I18n.t('OFFICES.GRID_HEADER.COUNTRY')}
              render={this.renderCountry}
            />
          </GridView>
        </div>
      </div>
    );
  }
}

export default List;
