import React, { Component } from 'react';
import I18n from 'i18n-js';
import { get, startCase } from 'lodash';
import PropTypes from 'constants/propTypes';
import Placeholder from 'components/Placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import { authoritiesOptionsQuery } from 'graphql/queries/auth';
import { getUserTypeByDepartment } from './utils';
import OperatorGridFilter from './OperatorGridFilter';
import OperatorsGrid from './OperatorsGrid';

const EMAIL_ALREADY_EXIST = 'error.validation.email.exists';

class List extends Component {
  static propTypes = {
    ...PropTypes.router,
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
    submitNewOperator: PropTypes.func.isRequired,
    filterValues: PropTypes.object,
    operators: PropTypes.shape({
      operators: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.any),
      }),
      loadMore: PropTypes.func,
      loading: PropTypes.bool.isRequired,
    }),
    operatorType: PropTypes.string,
    notify: PropTypes.func.isRequired,
  };

  static defaultProps = {
    filterValues: null,
    operators: {
      operators: {},
      loading: false,
    },
    operatorType: '',
  };

  state = {
    filters: {},
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters }, () => {
      this.props.history.replace({
        query: {
          filters: {
            ...filters,
          },
        },
      });
    });
  };

  handleSubmitNewOperator = async ({ department, role, branch, email, ...data }) => {
    const {
      modals: {
        createOperator,
        existingOperator,
      },
      submitNewOperator,
      notify,
    } = this.props;
    const userType = getUserTypeByDepartment(department, role);
    const operatorType = this.props.operatorType.toLowerCase();

    try {
      const {
        data: operatorData,
      } = await submitNewOperator({
        variables: { ...data, userType, department, role, email, branchId: branch },
      });

      const newOperator = get(operatorData, `${operatorType}.create${startCase(operatorType)}.data`);
      const newOperatorError = get(operatorData, `${operatorType}.create${startCase(operatorType)}.error`);
      const error = get(newOperatorError, 'error', null);

      if (error === EMAIL_ALREADY_EXIST) {
        createOperator.hide();
        existingOperator.show({
          department,
          role,
          branchId: branch,
          email,
        });

        return;
      }
      createOperator.hide();

      const { uuid } = newOperator;

      this.props.history.push(`/${operatorType.toLowerCase()}s/${uuid}/profile`);
    } catch (e) {
      createOperator.hide();
      notify({
        level: 'error',
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
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
      };

      modals.createOperator.show({
        onSubmit: this.handleSubmitNewOperator,
        initialValues,
        departmentsRoles: departmentRole || {},
      });
    } else {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.GET_AUTHORITIES_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.GET_AUTHORITIES_ERROR.MESSAGE'),
      });
    }
  };

  render() {
    const { filters } = this.state;
    const {
      operators,
      operators: { loading },
      filterValues,
      operatorType,
    } = this.props;

    const totalElements = get(operators, 'operators.data.totalElements');

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
                    {I18n.t(`COMMON.${operatorType}S_FOUND`)}
                  </div>
                </span>
              </When>
              <Otherwise>
                <span className="font-size-20">
                  {I18n.t(`${operatorType}S.HEADING`)}
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
              {I18n.t(`${operatorType}S.CREATE_OPERATOR_BUTTON`)}
            </button>
          </PermissionContent>
        </div>

        <OperatorGridFilter
          onSubmit={this.handleFiltersChanged}
          initialValues={filters}
          filterValues={filterValues}
        />
        <OperatorsGrid operatorsQuery={operators} operatorType={operatorType} />
      </div>
    );
  }
}

export default List;
