import React, { Component } from 'react';
import { Form } from 'react-final-form';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Joi from 'joi-browser';
import { Modal, Button } from '@newage/casino_backoffice_ui';
import { createValidator } from '@newage/casino_backoffice_utils';
import { I18n } from 'react-redux-i18n';

const schema = Joi.object().keys({
  name: Joi.string(),
  status: Joi.string(),
  tag: Joi.string(),
  files: Joi.object(),
});
const validator = createValidator(schema, I18n, 'route.conditionalTags.component.FilterForm');

class AddTagsModal extends Component {
  static propTypes = {
    notify: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
  };

  handleSubmit = async data => {

  };

  render() {
    const {
      isOpen,
      onClose,
    } = this.props;

    return (
      <Form
        validate={validator}
        onSubmit={this.handleSubmit}
        render={({ submitting, invalid, handleSubmit }) => (
          <Modal
            isOpen={isOpen}
            buttonLabel={I18n.t('common.cancel')}
            contentClassName="text-center"
            footerContent={
              <Button
                className="ml-auto"
                type="submit"
                form="add-tag-modal-form"
                disabled={submitting || invalid}
              >
                {I18n.t('common.confirm')}
              </Button>
            }
            onClose={onClose}
            header={I18n.t('route.conditionalTags.component.AddTagModal.title')}
          >
            <form id="add-tag-modal-form" onSubmit={handleSubmit}>

            </form>
          </Modal>
        )}
      />
    );
  }
}

export default AddTagsModal;
