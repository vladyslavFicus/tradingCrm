import React, { Component } from 'react';
import { Form, Field } from 'react-final-form';
import PropTypes from 'prop-types';
import { get, set } from 'lodash';
import Joi from 'joi-browser';
import { FORM_ERROR } from 'final-form';
import { Modal, Button, InputField } from '@newage/backoffice_ui';
import { createValidator } from '@newage/backoffice_utils';
import { I18n } from 'react-redux-i18n';
import {
  MultiInputField,
  FileInput,
} from '../../../../../../components/ReduxForm';

const schema = Joi.object().keys({
  name: Joi.string().required(),
  tag: Joi.array().required(),
  file: Joi.any().required(),
});
const validator = createValidator(schema, I18n, 'route.conditionalTags.component.FilterForm');

class AddTagsModal extends Component {
  static propTypes = {
    notify: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    addTags: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
  };

  handleSubmit = async ({ tag, ...data }) => {
    const { notify, addTags, createOrLinkTag, onClose, onConfirm } = this.props;
    const tagCreationResult = await createOrLinkTag({ variables: { tagName: tag[0] } });
    const { data: tagData, error: tagError } = get(tagCreationResult, 'data.tag.createOrLink', { data: '', error: '' });

    if (tagError) {
      const errorMessage = I18n.t(
        tagError.error ||
        'route.conditionalTags.component.AddTagModal.createTagFailed'
      );
      notify({
        level: 'error',
        title: I18n.t('route.conditionalTags.component.AddTagModal.title'),
        message: errorMessage,
      });

      return { [FORM_ERROR]: errorMessage };
    }

    const result = await addTags({
      variables: {
        ...data,
        type: 'EMAIL',
        tag: tagData[0].tagId,
        file: data.file[0],
      },
    });
    const { error } = get(result, 'data.conditionalTag.addTags', {
      data: null,
      error: null,
    });

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('route.conditionalTags.component.AddTagModal.title'),
      message: I18n.t(
        error ?
          error.error ||
          'route.conditionalTags.component.AddTagModal.addFailed' :
          'route.conditionalTags.component.AddTagModal.addSuccess'
      ),
    });

    if (error) {
      const fieldsErrors = {};

      if (error.fields_errors) {
        Object.keys(error.fields_errors)
          .forEach(i => set(fieldsErrors, i, error.fields_errors[i]));
      }

      return { [FORM_ERROR]: error.error, ...fieldsErrors };
    }

    onClose();
    onConfirm();
  };

  render() {
    const {
      isOpen,
      onClose,
    } = this.props;

    return (
      <Form
        validate={validator}
        key={`add-tags-form${isOpen ? 'active': 'disabled'}`}
        onSubmit={this.handleSubmit}
        render={({ submitting, invalid, handleSubmit, change }) => (
          <Modal
            isOpen={isOpen}
            buttonLabel={I18n.t('common.cancel')}
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
            header={I18n.t('route.conditionalTags.component.AddTagsModal.title')}
          >
            <form id="add-tag-modal-form" className="row" onSubmit={handleSubmit}>
              <Field
                name="name"
                type="text"
                label={I18n.t('route.conditionalTags.component.AddTagsModal.name')}
                placeholder={I18n.t('route.conditionalTags.component.AddTagsModal.namePlaceholder')}
                component={InputField}
                disabled={submitting}
                className="col-12"
              />
              <Field
                name="file"
                label={I18n.t('route.conditionalTags.component.AddTagsModal.file')}
                component={FileInput}
                onChange={change}
                disabled={submitting}
                placeholder={I18n.t('route.conditionalTags.component.AddTagsModal.filePlaceholder')}
                className="col-6"
              />
              <Field
                name="tag"
                label={I18n.t('route.conditionalTags.component.AddTagsModal.tag')}
                component={MultiInputField}
                async
                maxLength={1}
                disabled={submitting}
                placeholder={I18n.t('route.conditionalTags.component.AddTagsModal.tagsPlaceholder')}
                className="col-6"
              />
            </form>
          </Modal>
        )}
      />
    );
  }
}

export default AddTagsModal;
