import React, { Component } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import Placeholder from 'components/Placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import { authoritiesOptionsQuery } from 'graphql/queries/auth';
import OperatorGridFilter from './OperatorGridFilter';
import OperatorsGrid from './OperatorsGrid';

class List extends Component {
  static propTypes = {
    ...PropTypes.router,
    modals: PropTypes.shape({
      createOperator: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
    operators: PropTypes.shape({
      operators: PropTypes.pageable(PropTypes.any),
      loadMore: PropTypes.func,
      loading: PropTypes.bool.isRequired,
    }),
    notify: PropTypes.func.isRequired,
  };

  static defaultProps = {
    operators: {
      operators: {},
      loading: false,
    },
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
    this.props.history.replace({ query: { filters } });
  };

  handleFilterReset = () => {
    this.props.history.replace({ query: { filters: {} } });
  };

  handleOpenCreateModal = async () => {
    const {
      modals: {
        createOperator,
        existingOperator,
      },
      notify,
      client,
    } = this.props;

    try {
      const {
        data: {
          authoritiesOptions,
        },
      } = await client.query({ query: authoritiesOptionsQuery });

      delete authoritiesOptions.PLAYER;
      delete authoritiesOptions.AFFILIATE;

      const [department] = Object.keys(authoritiesOptions);

      const initialValues = {
        department,
        role: department ? authoritiesOptions[department][0] : null,
      };

      createOperator.show({
        initialValues,
        departmentsRoles: authoritiesOptions || [],
        onExist: (value) => {
          existingOperator.show({
            ...value,
          });
        },
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.GET_AUTHORITIES_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.GET_AUTHORITIES_ERROR.MESSAGE'),
      });
    }
  };

  render() {
    const {
      operators,
      operators: { loading },
    } = this.props;

    const totalElements = get(operators, 'operators.totalElements');

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
              <When condition={totalElements}>
                <span className="font-size-20 height-55">
                  <div>
                    <strong>{totalElements} </strong>
                    {I18n.t('COMMON.OPERATORS_FOUND')}
                  </div>
                </span>
              </When>
              <Otherwise>
                <span className="font-size-20">
                  {I18n.t('OPERATORS.HEADING')}
                </span>
              </Otherwise>
            </Choose>
          </Placeholder>
          <PermissionContent permissions={permissions.OPERATORS.CREATE}>
            <button
              type="button"
              className="btn btn-default-outline ml-auto"
              onClick={this.handleOpenCreateModal}
              id="create-new-operator-button"
            >
              {I18n.t('OPERATORS.CREATE_OPERATOR_BUTTON')}
            </button>
          </PermissionContent>
        </div>

        <OperatorGridFilter
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
        />
        <OperatorsGrid operatorsQuery={operators} />
      </div>
    );
  }
}

export default List;
