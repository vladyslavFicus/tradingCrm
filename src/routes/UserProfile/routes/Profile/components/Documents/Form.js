import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import { shortify } from 'utils/uuid';
import moment from 'moment';
import StatusDropDown from './StatusDropDown';

class Form extends Component {
  handleStatusChange = (data) => {
    console.log('implement', data);
  };
  
  render() {
    const dataSource = [
      {
        fileName: 'myidscan2016.jpg',
        datetime: '2017-03-07T13:31:08.261',
        status: 'VERIFIED'
      },
      {
        fileName: 'myidscan2016.jpg',
        datetime: '2017-03-07T13:31:08.261',
        status: 'VERIFIED'
      },
      {
        fileName: 'myidscan2016.jpg',
        datetime: '2017-03-07T13:31:08.261',
        status: 'VERIFIED'
      },
    ];

    return (
      <div className="player__account__page__kyc-document--list">
        <GridView
          tableClassName="table table-hovered documents-table"
          headerClassName=""
          dataSource={dataSource}
          totalPages={0}
        >
          <GridColumn
            name="file"
            header="File"
            headerClassName='text-uppercase'
            render={this.renderFile}
          />
          <GridColumn
            name="datetime"
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
          <span className="font-weight-700">{data.fileName}</span> {' - '}
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
          {moment(data.datetime).format('DD.MM.YYYY')}
        </div>
        <span className="font-size-10 color-default">
          {moment(data.datetime).format('HH:mm')}
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
                {data.status}
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
