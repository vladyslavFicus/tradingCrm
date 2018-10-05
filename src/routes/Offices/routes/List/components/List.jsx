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
    modals: PropTypes.shape({
      officeModal: PropTypes.modalType,
      infoModal: PropTypes.modalType,
    }).isRequired,
    countries: PropTypes.object.isRequired,
    auth: PropTypes.shape({
      isAdministration: PropTypes.bool.isRequired,
      operatorHierarchy: PropTypes.object,
    }).isRequired,
  };

  componentWillUnmount() {
    this.handleFilterReset();
  }

  handleFiltersChanged = (filters = {}) => history.replace({ query: { filters } });

  handleFilterReset = () => history.replace({ query: { filters: {} } });

  handleOfficeClick = ({ id }) => {
    history.push(`/offices/${id}`);
  };

  triggerOfficeModal = () => {
    const {
      modals: { officeModal },
    } = this.props;

    officeModal.show({
      onSubmit: values => this.handleAddOffice(values),
    });
  }

  handleAddOffice = async (variables) => {
    const {
      createOffice,
      modals: { officeModal, infoModal },
      auth,
    } = this.props;

    const { uuid: operatorId, parentBranches: operatorBranches = [], userType } = get(auth, 'operatorHierarchy');
    const { data: { hierarchy: { createOffice: { data, error } } } } = await createOffice(
      {
        variables: {
          operatorId,
          operatorBranches,
          userType,
          officeManager: 'OPERATOR-d8475511-d999-4754-b7af-cd2f724ee4f3e',
          ...variables,
        },
      },
    );

    // refetch();
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

  renderOffice = data => (
    <Fragment>
      <div className="font-weight-700">
        {data.name} {data.surname}
      </div>
      <div className="font-size-11">
        <Uuid uuid={data.id} uuidPrefix="OF" />
      </div>
    </Fragment>
  );

  renderCountry = ({ country, language }) => (
    <CountryLabelWithFlag
      code={country}
      height="14"
      languageCode={language}
    />
  );

  render() {
    const {
      locale,
      // leads: {
      //   loading,
      //   leads,
      // },
      location: { query },
      countries,
      auth: { isAdministration },
    } = this.props;

    const loading = false;

    const entities = get(this.props, 'leads.data') || { content: [] };
    const filters = get(query, 'filters', {});

    const allowActions = Object
      .keys(filters)
      .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            // ready={!loading && !!leads}
            ready
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
          disabled={!allowActions}
          countries={countries}
        />

        <div className="card-body">
          <GridView
            dataSource={entities.content}
            last
            locale={locale}
            showNoResults={!loading && entities.content.length === 0}
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
