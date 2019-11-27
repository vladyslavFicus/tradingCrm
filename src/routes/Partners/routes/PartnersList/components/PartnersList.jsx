import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { Link } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { get, startCase } from 'lodash';
import Placeholder from 'components/Placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import history from 'router/history';
import {
  statusColorNames as operatorStatusColorNames,
  statusesLabels as operatorStatusesLabels,
} from 'constants/operators';
import permissions from 'config/permissions';
import Uuid from 'components/Uuid';
import GridView, { GridViewColumn } from 'components/GridView';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import PermissionContent from 'components/PermissionContent';
import parseErrorsFromServer from 'utils/parseErrorsFromServer';
import { authoritiesOptionsQuery } from 'graphql/queries/auth';
import PartnerGridFilter from './PartnerGridFilter';

const EMAIL_ALREADY_EXIST = 'Email already exists';

class List extends Component {
  static propTypes = {
    modals: PropTypes.shape({
      createOperator: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
      existingOperator: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
    submitNewPartner: PropTypes.func.isRequired,
    filterValues: PropTypes.object,
    operators: PropTypes.shape({
      operators: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.any),
      }),
      loadMore: PropTypes.func,
      loading: PropTypes.bool.isRequired,
    }),
    partnerType: PropTypes.string,
    notify: PropTypes.func.isRequired,
  };

  static defaultProps = {
    filterValues: null,
    operators: {
      operators: {},
      loading: false,
    },
    partnerType: 'PARTNER',
  };

  state = {
    filters: {},
  };

  handlePageChanged = () => {
    const {
      operators: {
        loadMore,
        loading,
      },
    } = this.props;

    if (!loading) {
      loadMore();
    }
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters }, () => {
      history.replace({
        query: {
          filters: {
            ...filters,
          },
        },
      });
    });
  };

  handleSubmitNewPartner = async ({ department, role, branch, email, sendMail, ...data }) => {
    const {
      modals: {
        createPartner,
        existingOperator,
      },
      submitNewPartner,
    } = this.props;

    const partnerType = this.props.partnerType.toLowerCase();
    const affiliateType = data.isIB ? 'IB' : 'AFFILIATE';
    const newPartnerData = await submitNewPartner({
      variables: { ...data, email, affiliateType },
    });

    const newPartner = get(newPartnerData, `data.${partnerType}.create${startCase(partnerType)}.data`);
    const newPartnerError = get(newPartnerData, `${partnerType}.create${startCase(partnerType)}.error`);
    const submitErrors = get(newPartnerError, 'fields_errors', null);

    if (submitErrors) {
      const errors = parseErrorsFromServer(submitErrors);

      if (errors.email && errors.email === EMAIL_ALREADY_EXIST) {
        createPartner.hide();
        existingOperator.show({
          department,
          role,
          branchId: branch,
          email,
        });
      }

      throw new SubmissionError(errors);
    }
    createPartner.hide();

    const { uuid } = newPartner;

    history.push(`/partners/${uuid}/profile`);
  };

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

      modals.createPartner.show({
        onSubmit: this.handleSubmitNewPartner,
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

  renderStatus = ({ status, statusChangeDate }) => (
    <div>
      <div
        className={
          classNames(operatorStatusColorNames[status], 'text-uppercase font-weight-700')
        }
      >
        {I18n.t(operatorStatusesLabels[status]) || status}
      </div>
      {
        statusChangeDate
        && (
          <div className="font-size-11">
            {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangeDate).local().format('DD.MM.YYYY') })}
          </div>
        )
      }
    </div>
  );

  renderPartner = ({ uuid, fullName }) => (
    <div>
      <div className="font-weight-700" id={`operator-list-${uuid}-main`}>
        <Link to={`/partners/${uuid}/profile`}>{fullName}</Link>
      </div>
      <div className="font-size-11" id={`operator-list-${uuid}-additional`}>
        <Uuid uuid={uuid} />
      </div>
    </div>
  );

  renderCountry = ({ country }) => (
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

  renderRegistered = ({ createdAt }) => (
    <div>
      <div className="font-weight-700">
        {moment.utc(createdAt).local().format('DD.MM.YYYY')}
      </div>
      <div className="font-size-11">
        {moment.utc(createdAt).local().format('HH:mm')}
      </div>
    </div>
  );

  render() {
    const { filters } = this.state;
    const {
      operators,
      operators: { loading },
      filterValues,
      partnerType,
    } = this.props;

    const entities = get(operators, 'operators.data') || { content: [] };

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            ready={!loading && !!operators}
            className={null}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '220px', height: '12px' }} />
              </div>
            )}
          >
            <Choose>
              <When condition={!!entities.totalElements}>
                <span className="font-size-20 height-55">
                  <div>
                    <strong>{entities.totalElements} </strong>
                    {I18n.t(`COMMON.${partnerType}S_FOUND`)}
                  </div>
                </span>
              </When>
              <Otherwise>
                <span className="font-size-20">
                  {I18n.t(`${partnerType}S.HEADING`)}
                </span>
              </Otherwise>
            </Choose>
          </Placeholder>
          <PermissionContent permissions={permissions.PARTNERS.CREATE}>
            <button
              type="button"
              className="btn btn-default-outline ml-auto"
              onClick={this.handleOpenCreateModal}
              id="create-new-operator-button"
            >
              {I18n.t(`${partnerType}S.CREATE_PARTNER_BUTTON`)}
            </button>
          </PermissionContent>
        </div>

        <PartnerGridFilter
          onSubmit={this.handleFiltersChanged}
          initialValues={filters}
          filterValues={filterValues}
        />

        <div className="card-body">
          <GridView
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.page}
            last={entities.last}
            lazyLoad
            showNoResults={!loading && entities.content.length === 0}
            loading={loading}
          >
            <GridViewColumn
              name="uuid"
              header={I18n.t('PARTNERS.GRID_HEADER.PARTNER')}
              render={this.renderPartner}
            />
            <GridViewColumn
              name="country"
              header={I18n.t('PARTNERS.GRID_HEADER.COUNTRY')}
              render={this.renderCountry}
            />
            <GridViewColumn
              name="registered"
              header={I18n.t('PARTNERS.GRID_HEADER.REGISTERED')}
              render={this.renderRegistered}
            />
            <GridViewColumn
              name="status"
              header={I18n.t('PARTNERS.GRID_HEADER.STATUS')}
              render={this.renderStatus}
            />
          </GridView>
        </div>
      </div>
    );
  }
}

export default List;
