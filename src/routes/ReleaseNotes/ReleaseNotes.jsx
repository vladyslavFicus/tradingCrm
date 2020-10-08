import React, { Fragment, PureComponent } from 'react';
import { startCase } from 'lodash';
import { getBackofficeBrand } from 'config';
import ShortLoader from 'components/ShortLoader';

class ReleaseNotes extends PureComponent {
  state = {
    loading: true,
    content: null,
  };

  async componentDidMount() {
    const response = await fetch('/cloud-static/RELEASE-NOTES.html');
    const content = await response.text();

    this.setState({ content, loading: false });
  }

  render() {
    const { loading, content } = this.state;

    return (
      <Fragment>
        <h1>{startCase(getBackofficeBrand().id)} CRM<br />Release notes</h1>
        <Choose>
          <When condition={loading}>
            <ShortLoader />
          </When>
          <Otherwise>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </Otherwise>
        </Choose>
      </Fragment>
    );
  }
}

export default ReleaseNotes;
