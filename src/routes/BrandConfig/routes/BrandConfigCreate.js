import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { Button } from 'reactstrap';
import { withRequests } from 'apollo';
import { withNotifications } from 'components/HighOrder';
import BrandConfigEditor from './components/BrandConfigEditor';
import {
  BrandConfigCreateMutation,
} from './graphql';
import './BrandConfig.scss';

class BrandConfigCreate extends PureComponent {
  static propTypes = {
    createBrandConfig: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  handleCreate = async () => {
    const { notify, createBrandConfig } = this.props;
    const {
      data: {
        brandConfig: {
          create: { error },
        },
      },
    } = await createBrandConfig({
      variables: this.editor.getValue(),
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('BRAND_CONFIG.NOTIFICATIONS.CREATE_ERROR'),
        message: error.error || error.fields_errors || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    } else {
      notify({
        level: 'success',
        title: I18n.t('BRAND_CONFIG.NOTIFICATIONS.CREATE_SUCCESS'),
      });
    }
  };

  handleReset = () => {
    this.editor.resetValue();
  };

  render() {
    return (
      <div className="brand-config">
        <div className="brand-config__actions">
          <Button
            color="primary"
            onClick={this.handleReset}
            className="brand-config__btn"
          >
            {I18n.t('BRAND_CONFIG.ACTIONS.DISCARD')}
          </Button>
          <Button
            color="primary"
            onClick={this.handleCreate}
            className="brand-config__btn"
          >
            {I18n.t('BRAND_CONFIG.ACTIONS.CREATE')}
          </Button>
        </div>
        <BrandConfigEditor
          ref={(editor) => { this.editor = editor; }}
        />
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    createBrandConfig: BrandConfigCreateMutation,
  }),
)(BrandConfigCreate);
