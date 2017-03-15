import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import { shortify } from 'utils/uuid';
import moment from 'moment';
import StatusDropDown from './StatusDropDown';

class Form extends Component {
  handleStatusChange = (data) => {
    console.log('implement handleStatusChange ', data);
  };
  
  render() {
    const { entities } = this.props;

    return (
      <div className="player__account__page__kyc-document--list">
        <GridView
          tableClassName="table table-hovered documents-table"
          headerClassName=""
          dataSource={entities}
          totalPages={0}
        >
          <GridColumn
            name="realName"
            header="File"
            headerClassName='text-uppercase'
            render={this.renderFile}
          />
          <GridColumn
            name="uploadDate"
            header="Date & Time"
            headerClassName='text-uppercase'
            render={this.renderDateTime}
          />
          <GridColumn
            name="status"
            header="Status"
            headerClassName='text-uppercase'
            render={this.renderStatus}
          />
        </GridView>
        <div className="text-center">
          <a href="#" className="player__account__page__kyc-document-add btn btn-default-outline">
            +Add document
          </a>
        </div>
      </div>
    );
  }

  renderFile = (data) => {
    return (
      <div>
        <div>
          <span className="font-weight-700">{data.realName}</span> {' - '}
          <span>{shortify('345d5445', 'FL')}</span>
        </div>
        <span className="font-size-10 color-default">{shortify('83675', 'OP')}</span>
      </div>
    );
  };

  renderDateTime = (data) => {
    return (
      <div>
        <div className="font-weight-700">
          {moment(data.uploadDate).format('DD.MM.YYYY')}
        </div>
        <span className="font-size-10 color-default">
          {moment(data.uploadDate).format('HH:mm')}
        </span>
      </div>
    );
  };

  renderStatus = (data) => {
    return (
      <div>
        <StatusDropDown
          onStatusChange={this.handleStatusChange}
          label={
            <div>
              <div className='color-success font-weight-700'>
                {data.status.value}
              </div>
              <span className="font-size-10 color-default">
                {shortify('83675', 'OP')}
              </span>
            </div>
          }
        />
      </div>
    );
  };

}

export default Form;
