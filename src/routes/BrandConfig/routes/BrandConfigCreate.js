import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { Button } from 'reactstrap';
import { withRequests, parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import StickyWrapper from 'components/StickyWrapper';
import BrandConfigEditor from './components/BrandConfigEditor';
import { BrandConfigCreateMutation } from './graphql';
import './BrandConfig.scss';

class BrandConfigCreate extends PureComponent {
  static propTypes = {
    createBrandConfig: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  handleCreate = async () => {
    const { notify, createBrandConfig } = this.props;

    try {
      await createBrandConfig({
        variables: this.editor.getValue(),
      });

      notify({
        level: 'success',
        title: I18n.t('BRAND_CONFIG.NOTIFICATIONS.CREATE_SUCCESS'),
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('BRAND_CONFIG.NOTIFICATIONS.CREATE_ERROR'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  handleReset = () => {
    this.editor.resetValue();
  };

  render() {
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
              onClick={this.handleCreate}
              className="brand-config__btn"
            >
              {I18n.t('BRAND_CONFIG.ACTIONS.CREATE')}
            </Button>
          </div>
        </StickyWrapper>
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
