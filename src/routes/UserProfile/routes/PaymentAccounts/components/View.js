import React, { Component } from 'react';
import moment from 'moment';
import { targetTypes } from '../../../../../constants/note';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../components/GridView';
import { shortify } from '../../../../../utils/uuid';
import PopoverButton from '../../../../../components/PopoverButton';

class View extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    paymentAccounts: PropTypes.arrayOf(PropTypes.userPaymentAccountEntity),
    fetchEntities: PropTypes.func.isRequired,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.handleRefresh();
    this.context.setNoteChangedCallback(this.handleRefresh);
  }

  componentWillUnmount() {
    this.context.setNoteChangedCallback(null);
  }

  handleRefresh = () => {
    return this.props.fetchEntities(this.props.params.id);
  };

  handleNoteClick = (target, data) => {
    if (data.note) {
      this.context.onEditNoteClick(target, data.note, { placement: 'left' });
    } else {
      this.context.onAddNoteClick(data.uuid, targetTypes.PAYMENT_ACCOUNT)(target, { placement: 'left' });
    }
  };

  renderPaymentAccount = (data) => {
    return (
      <div>
        <div className="font-weight-700 text-uppercase">{data.paymentMethod}</div>
        <div className="text-muted font-size-10">{shortify(data.details)}</div>
      </div>
    );
  };

  renderAddDate = (data) => {
    return (
      <div>
        <div className="font-weight-700">
          {moment(data.creationDate).format('DD.MM.YYYY')}
        </div>
        <span className="font-size-10 color-default">
          {moment(data.creationDate).format('HH:mm:ss')}
        </span>
      </div>
    );
  };

  renderLastPaymentDate = (data) => {
    if (!(data.lastPayment && data.lastPayment.creationTime)) {
      return null;
    }

    return (
      <div>
        <div className="font-weight-700">
          {moment(data.lastPayment.creationTime).format('DD.MM.YYYY')}
        </div>
        <span className="font-size-10 color-default">
          {moment(data.lastPayment.creationTime).format('HH:mm:ss')}
        </span>
      </div>
    );
  };

  renderNotes = (data) => {
    return (
      <div>
        <PopoverButton
          id={`payment-account-item-note-button-${data.uuid}`}
          className="cursor-pointer margin-right-5"
          onClick={id => this.handleNoteClick(id, data)}
        >
          {data.note
            ? <i className="fa fa-sticky-note" />
            : <i className="fa fa-sticky-note-o" />
          }
        </PopoverButton>
      </div>
    );
  };

  render() {
    const { paymentAccounts } = this.props;

    return (
      <div className={'tab-pane fade in active profile-tab-container'}>
        <div className="row margin-bottom-20">
          <div className="col-md-3">
            <span className="font-size-20">Payments</span>
          </div>
        </div>

        <GridView
          dataSource={paymentAccounts}
          tableClassName="table table-hovered data-grid-layout"
          headerClassName="text-uppercase"
          totalPages={1}
        >
          <GridColumn
            name="paymentMethod"
            header="Payment Account"
            render={this.renderPaymentAccount}
          />
          <GridColumn
            name="dateAdded"
            header="Date Added"
            render={this.renderAddDate}
          />
          <GridColumn
            name="lastPayment"
            header="Last Payment"
            render={this.renderLastPaymentDate}
          />
          <GridColumn
            name="notes"
            header="Note"
            headerClassName="text-uppercase"
            render={this.renderNotes}
          />
        </GridView>
      </div>
    );
  }
}

export default View;
