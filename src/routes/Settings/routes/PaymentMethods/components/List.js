import React, { Component } from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import SortableGridView from 'components/GridView/SortableGridView';
import { GridViewColumn } from 'components/GridView';
import Amount from 'components/Amount';
import LimitPopover from 'components/PaymentMethodLimitPopover';
import PopoverButton from 'components/PopoverButton';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import Permissions from 'utils/permissions';
import AvailabilityPopover from './AvailabilityPopover';
import MethodGridFilter from './MethodsGridFilter';
import StatusDropDown from './StatusDropDown';
import './List.scss';

const DragHandle = SortableHandle(({ order }) => <span className="drag-item">:: {order}</span>);
const PAYMENT_METHOD_LIMIT_POPOVER = 'payment-method-limit-popover';
const PAYMENT_METHOD_AVAILABILITY_POPOVER = 'payment-method-availability-popover';

const popoverInitialState = {
  name: null,
  params: {},
};

class List extends Component {
  static propTypes = {
    loadPaymentMethods: PropTypes.func.isRequired,
    disableLimit: PropTypes.func.isRequired,
    enableLimit: PropTypes.func.isRequired,
    changeStatus: PropTypes.func.isRequired,
    changeLimit: PropTypes.func.isRequired,
    changePaymentMethodOrder: PropTypes.func.isRequired,
    getCountryAvailability: PropTypes.func.isRequired,
    paymentMethods: PropTypes.arrayOf(PropTypes.paymentMethod),
  };

  static contextTypes = {
    permissions: PropTypes.array.isRequired,
  };

  static defaultProps = {
    paymentMethods: [],
  };

  state = {
    activePopoverUUID: null,
    popover: { ...popoverInitialState },
    filters: {},
  };

  componentDidMount() {
    this.handleRefresh();
  }

  get readOnly() {
    const { permissions: currentPermission } = this.context;

    const permittedRights = [
      permissions.SETTINGS.CHANGE_LIMIT,
      permissions.SETTINGS.ENABLE_METHOD,
      permissions.SETTINGS.DISABLE_METHOD,
      permissions.SETTINGS.CHANGE_STATUS,
    ];

    return !(new Permissions(permittedRights).check(currentPermission));
  }

  handleRefresh = () => {
    this.props.loadPaymentMethods(this.state.filters);
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters }, () => this.handleRefresh());
  };

  handleSetLimitClick = (target, params = {}) => {
    this.setState({
      activePopoverUUID: `${params.type}-${params.methodUUID}`,
      popover: {
        name: PAYMENT_METHOD_LIMIT_POPOVER,
        params: {
          ...params,
          target,
          initialValues: {
            min: params.min,
            max: params.max,
          },
        },
      },
    });
  };

  handleOpenCountryAvailability = async (target, methodUUID) => {
    const action = await this.props.getCountryAvailability(methodUUID);

    if (action && !action.error) {
      this.setState({
        popover: {
          name: PAYMENT_METHOD_AVAILABILITY_POPOVER,
          params: {
            target,
            methodUUID,
            countries: action.payload,
          },
        },
      });
    }
  };

  handleDisableLimit = async (methodUUID, limitUUID) => {
    const action = await this.props.disableLimit(methodUUID, limitUUID);
    if (action && !action.error) {
      this.handlePopoverHide();
      this.handleRefresh();
    }
  };

  handleEnabledLimit = async (methodUUID, limitUUID) => {
    const action = await this.props.enableLimit(methodUUID, limitUUID);
    if (action && !action.error) {
      this.handlePopoverHide();
      this.handleRefresh();
    }
  };

  handleChangeStatus = uuid => async (action) => {
    const responseAction = await this.props.changeStatus(uuid, action);
    if (responseAction && !responseAction.error) {
      this.handleRefresh();
    }
  };

  handleChangeLimit = async (methodUUID, limitUUID, data) => {
    const responseAction = await this.props.changeLimit(methodUUID, limitUUID, data);
    if (responseAction && !responseAction.error) {
      this.handlePopoverHide();
      this.handleRefresh();
    }
  };

  handlePopoverHide = () => {
    this.setState({ activePopoverUUID: null, popover: { ...popoverInitialState } });
  };

  handleSortEnd = async (orderParams) => {
    const action = await this.props.changePaymentMethodOrder({
      ...orderParams,
      countryCode: this.state.filters.countryCode,
    });
    if (action && !action.error) {
      this.handleRefresh();
    }
  };

  renderStatus = data => (
    <StatusDropDown
      status={data.status}
      onStatusChange={this.handleChangeStatus(data.uuid)}
      readOnly={this.readOnly}
    />
  );

  renderLimitRepresentation = (data, column) => {
    const {
      disabled, available, min, max, currencyCode,
    } = data[column.name];

    if (!available) {
      return <span className="color-warning">{I18n.t('PAYMENT.METHODS.LIMITS.NOT_AVAILABLE')}</span>;
    }

    if (disabled) {
      return <span className="color-danger">{I18n.t('PAYMENT.METHODS.LIMITS.DISABLED')}</span>;
    }

    if (!min && !max) {
      return <span>{I18n.t('PAYMENT.METHODS.LIMITS.NOT_LIMITED')}</span>;
    }

    if (min && max) {
      return (
        <span>
          <Amount amount={min} currency={currencyCode} />
          {' - '}
          <Amount amount={max} currency={currencyCode} />
        </span>
      );
    }

    if (min) {
      return <span> min. <Amount amount={min} currency={currencyCode} /> </span>;
    }

    if (max) {
      return <span> max. <Amount amount={max} currency={currencyCode} /> </span>;
    }

    return I18n.t('PAYMENT.METHODS.LIMITS.UNDEFINED');
  };

  renderLimit = (data, column) => {
    const item = data[column.name];

    const handleLimitPopoverClick = id => this.handleSetLimitClick(id, {
      ...item,
      methodUUID: data.uuid,
      limitUUID: item.uuid,
      type: column.name,
      limitType: column.name === 'depositLimit'
        ? I18n.t('PAYMENT_METHOD_LIMIT_POPOVER.DEPOSITS')
        : I18n.t('PAYMENT_METHOD_LIMIT_POPOVER.WITHDRAWALS'),
    });

    return (
      <PopoverButton
        id={`payment-method-limit-${item.uuid}`}
        onClick={this.readOnly
          ? () => {}
          : handleLimitPopoverClick
        }
        className={classNames(
          'payment-method-toggle',
          { open: `${column.name}-${data.uuid}` === this.state.activePopoverUUID },
        )}
      >
        {this.renderLimitRepresentation(data, column)}
        <If condition={!this.readOnly}>
          <i className="fa fa-angle-down payment-method-toggle__caret" />
        </If>
      </PopoverButton>
    );
  };

  renderCountryAvailability = (data) => {
    const { popover } = this.state;
    return (
      <PopoverButton
        id={`payment-method-availability-${data.uuid}`}
        onClick={id => this.handleOpenCountryAvailability(id, data.uuid)}
      >
        <i
          aria-hidden="true"
          className={classNames('fa font-size-30 fa-globe', {
            'color-info': popover.params.methodUUID === data.uuid
            && popover.name === PAYMENT_METHOD_AVAILABILITY_POPOVER,
          })}
        />
      </PopoverButton>
    );
  };

  render() {
    const { paymentMethods } = this.props;
    const { popover, filters } = this.state;

    return (
      <div className="card">
        <div className="card-heading font-size-20">
          {I18n.t('PAYMENT_METHODS.TITLE')}
        </div>

        <MethodGridFilter
          onSubmit={this.handleFiltersChanged}
        />

        <div className="card-body">
          <SortableGridView
            dataSource={paymentMethods.filter(paymentMethod => paymentMethod.methodName === 'cashier')}
            onSortEnd={this.handleSortEnd}
          >
            <GridViewColumn
              name="order"
              header={I18n.t('PAYMENT_METHODS.GRID.ORDER')}
              className="font-weight-700"
              render={data => <DragHandle order={data.order} />}
            />
            <GridViewColumn
              name="methodName"
              header={I18n.t('PAYMENT_METHODS.GRID.PAYMENT_METHOD')}
              className="font-weight-700 text-uppercase"
            />
            <GridViewColumn
              name="depositLimit"
              header={I18n.t('PAYMENT_METHODS.GRID.DEPOSIT')}
              render={this.renderLimit}
              className="font-weight-700"
            />
            <GridViewColumn
              name="withdrawLimit"
              header={I18n.t('PAYMENT_METHODS.GRID.WITHDRAWAL')}
              render={this.renderLimit}
              className="font-weight-700"
            />
            {
              !filters.countryCode
              && (
                <GridViewColumn
                  name="availability"
                  header={I18n.t('PAYMENT_METHODS.GRID.AVAILABILITY')}
                  className="text-center"
                  headerClassName="text-center"
                  render={this.renderCountryAvailability}
                />
              )
            }
            {
              !filters.countryCode
              && (
                <GridViewColumn
                  name="status"
                  header={I18n.t('PAYMENT_METHODS.GRID.STATUS')}
                  render={this.renderStatus}
                  className="text-uppercase"
                />
              )
            }
          </SortableGridView>
        </div>

        {
          popover.name === PAYMENT_METHOD_LIMIT_POPOVER
          && (
            <LimitPopover
              toggle={this.handlePopoverHide}
              isOpen
              onSubmit={this.handleChangeLimit}
              onDisable={this.handleDisableLimit}
              onEnable={this.handleEnabledLimit}
              {...popover.params}
            />
          )
        }

        {
          popover.name === PAYMENT_METHOD_AVAILABILITY_POPOVER
          && (
            <AvailabilityPopover
              toggle={this.handlePopoverHide}
              isOpen
              onSubmit={this.handleChangeLimit}
              {...popover.params}
            />
          )
        }
      </div>
    );
  }
}

export default List;
