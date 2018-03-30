import React, { Component } from 'react';
import PropTypes from '../../../../../../../constants/propTypes';
import Form from './Form';

class View extends Component {
  static propTypes = {
    campaign: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      campaign: PropTypes.shape({
        data: PropTypes.newBonusCampaignEntity.isRequired,
      }),
    }).isRequired,
  };
  render() {
    const {
      campaign: {
        campaign: {
          data: {
            name,
          },
        },
      },
    } = this.props;

    return (
      <Form
        initialValues={{
          name,
        }}
        form="settings"
        onSubmit={() => {}}
      />
    );
  }
}

export default View;
