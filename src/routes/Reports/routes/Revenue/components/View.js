import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import Form from './Form';

class View extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(data) {
    this.props.onDownload(data);
  }

  render() {
    const { errors, values } = this.props;
    console.log(values);

    return <div className="page-content-inner">
      <Panel withBorders>
        <Title>
          <h3>Revenue report</h3>
        </Title>

        <Content>
          <Form
            fields={values}
            errors={errors}
            onSubmit={this.handleSubmit}
          />
        </Content>
      </Panel>
    </div>;
  }
}

View.propTypes = {};

export default View;
