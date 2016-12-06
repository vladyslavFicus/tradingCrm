import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import classNames from 'classnames';

const config = { tabName: 'profile' };

class View extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const { params, fetchGameActivity } = this.props;

    fetchGameActivity();
  }

  render() {
    const { items, } = this.props;

    return <div id={`tab-${config.tabName}`} className={classNames('tab-pane fade in active')}>
      <GridView
        dataSource={items || []}
        onFiltersChanged={() => {
        }}
        onPageChange={() => {
        }}
        activePage={0}
        totalPages={1}
      >
        <GridColumn
          name="@class"
          header="Class"
          headerStyle={{ width: '20%' }}
          render={(data, column) => <small>{data.message[column.name]}</small>}
        />
      </GridView>
    </div>;
  }
}

View.defaultProp = {
  items: [],
};

export default View;
