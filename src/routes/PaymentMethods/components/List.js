import React, { Component } from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import Panel, { Title, Content } from '../../../components/Panel';
import SortableGridView from '../../../components/GridView/SortableGridView';
import { GridColumn } from '../../../components/GridView';
import Amount from '../../../components/Amount';
import MethodGridFilter from './MethodsGridFilter';
import LimitPopover from '../../../components/PaymentMethodLimitPopover';
import PopoverButton from '../../../components/PopoverButton';
import PropTypes from '../../../constants/propTypes';
import StatusDropDown from './StatusDropDown';

const DragHandle = SortableHandle(({ order }) => <span>:: {order}</span>);
const PAYMENT_METHOD_LIMIT_POPOVER = 'payment-method-limit-popover';

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
    paymentMethods: PropTypes.arrayOf(PropTypes.paymentMethod),
  };

  state = {
    popover: { ...popoverInitialState },
    filters: {},
  };

  componentDidMount() {
    this.handleRefresh();
  }

  handleRefresh = () => {
    this.props.loadPaymentMethods(this.state.filters);
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters }, () => this.handleRefresh());
  };

  handleSetLimitClick = (target, params = {}) => {
    this.setState({
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

  handleDisableLimit = async (methodUUID, limitUUID) => {
    const action = this.props.disableLimit(methodUUID, limitUUID);
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
    this.setState({ popover: { ...popoverInitialState } });
  };

  renderStatus = data => (
    <StatusDropDown
      status={data.status}
      onStatusChange={this.handleChangeStatus(data.uuid)}
    />
  );

  renderLimitRepresentation = (data, column) => {
    const { disabled, min, max, currencyCode } = data[column.name];

    if (disabled) {
      return <span className="color-danger">Disabled</span>;
    }

    if (!min && !max) {
      return <span>Not limited</span>;
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

    return 'unavailable';
  };

  renderLimit = (data, column) => {
    const item = data[column.name];

    return (
      <PopoverButton
        id={`payment-method-${item.uuid}`}
        onClick={id => this.handleSetLimitClick(id, {
          ...item,
          methodUUID: data.uuid,
          limitUUID: item.uuid,
          type: column.name,
          limitType: column.name === 'depositLimit' ? 'deposits' : 'withdrawals',
        })}
      >
        {this.renderLimitRepresentation(data, column)}
      </PopoverButton>
    );
  };

  render() {
    const { paymentMethods } = this.props;
    const { popover } = this.state;

    return (
      <div className="page-content-inner">
        <Panel withBorders>
          <Title>
            <h3>Payment methods</h3>
          </Title>

          <MethodGridFilter
            onSubmit={this.handleFiltersChanged}
          />

          <Content>
            <SortableGridView
              tableClassName="table table-hovered data-grid-layout"
              headerClassName=""
              dataSource={paymentMethods}
            >
              <GridColumn
                name="order"
                header="Order"
                headerClassName={'text-uppercase'}
                className="font-weight-700"
                render={data => <DragHandle order={data.order} />}
              />
              <GridColumn
                name="methodName"
                header="Payment Method"
                headerClassName="text-uppercase"
                className="text-uppercase"
              />
              <GridColumn
                name="depositLimit"
                header="Deposit"
                headerClassName={'text-uppercase'}
                render={this.renderLimit}
              />
              <GridColumn
                name="withdrawalLimit"
                header="Withdrawal"
                headerClassName={'text-uppercase'}
                render={this.renderLimit}
              />
              <GridColumn
                name="status"
                header="Status"
                headerClassName={'text-uppercase'}
                render={this.renderStatus}
              />
            </SortableGridView>
          </Content>
        </Panel>

        {
          popover.name === PAYMENT_METHOD_LIMIT_POPOVER &&
          <LimitPopover
            toggle={this.handlePopoverHide}
            isOpen
            onSubmit={this.handleChangeLimit}
            onDisable={this.handleDisableLimit}
            onEnable={this.handleEnabledLimit}
            {...popover.params}
          />
        }
      </div>
    );
  }
}

export default List;
