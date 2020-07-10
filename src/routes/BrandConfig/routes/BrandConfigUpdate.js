import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { Button } from 'reactstrap';
import { get } from 'lodash';
import { withRequests, parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import StickyWrapper from 'components/StickyWrapper';
import ShortLoader from 'components/ShortLoader';
import BrandConfigEditor from './components/BrandConfigEditor';
import {
  BrandConfigGetQuery,
  BrandConfigUpdateMutation,
} from './graphql';
import './BrandConfig.scss';

class BrandConfigUpdate extends PureComponent {
  static propTypes = {
    brandConfigData: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      data: PropTypes.shape({
        brandConfig: PropTypes.shape({
          brandId: PropTypes.string,
          config: PropTypes.string,
        }),
      }),
    }).isRequired,
    updateBrandConfig: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  handleUpdate = async () => {
    if (!window.confirm(I18n.t('BRAND_CONFIG.NOTIFICATIONS.UPDATE_CONFIRM'))) return; // eslint-disable-line no-alert

    const { notify, updateBrandConfig } = this.props;

    try {
      await updateBrandConfig({
        variables: this.editor.getValue(),
      });

      notify({
        level: 'success',
        title: I18n.t('BRAND_CONFIG.NOTIFICATIONS.UPDATE_SUCCESS'),
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('BRAND_CONFIG.NOTIFICATIONS.UPDATE_ERROR'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  handleReset = () => {
    this.editor.resetValue();
  };

  render() {
    const { brandConfigData } = this.props;

    const value = get(brandConfigData, 'data.brandConfig') || '';

    if (brandConfigData.loading) {
      return <ShortLoader />;
    }

    return (
      <div className="brand-config">
        <StickyWrapper top={48} innerZ={5}>
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
              onClick={this.handleUpdate}
              className="brand-config__btn"
            >
              {I18n.t('BRAND_CONFIG.ACTIONS.SAVE')}
            </Button>
          </div>
        </StickyWrapper>
        <BrandConfigEditor
          value={value}
          ref={(editor) => { this.editor = editor; }}
        />
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    brandConfigData: BrandConfigGetQuery,
    updateBrandConfig: BrandConfigUpdateMutation,
  }),
)(BrandConfigUpdate);
