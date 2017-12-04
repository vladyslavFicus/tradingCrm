import React, { Component } from 'react';
import Card, { Title, Content } from 'components/Card';

export default class Create extends Component {
  render() {
    const { data }  = this.props;

    return <div className="page-content-inner">
      <Card>
        <Title>
          <h3>View term #{data.id}</h3>
        </Title>

        <Content>
          <div className="row">
            <div className="col-lg-8">
              <div className="margin-bottom-50">
                <div dangerouslySetInnerHTML={{ __html: data.content }}/>
              </div>
            </div>
          </div>
        </Content>
      </Card>
    </div>;
  }
}
