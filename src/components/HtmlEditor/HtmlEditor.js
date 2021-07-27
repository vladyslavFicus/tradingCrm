import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './HtmlEditor.scss';

class HtmlEditor extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    label: null,
    value: null,
    onChange: () => {},
  };

  static getDerivedStateFromProps(props, state) {
    const currentValue = draftToHtml(convertToRaw(state.editorState.getCurrentContent()));

    if (props.value === '' && currentValue !== '') {
      return {
        editorState: EditorState.createEmpty(),
      };
    }

    return null;
  }

  constructor(props) {
    super(props);

    let editorState = EditorState.createEmpty();

    if (props.value) {
      const blocksFromHtml = htmlToDraft(props.value);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

      editorState = EditorState.createWithContent(contentState);
    }

    this.state = {
      editorState,
    };
  }

  onEditorStateChange = (editorState) => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    this.props.onChange(html);

    this.setState({ editorState });
  };

  render() {
    const { label } = this.props;
    const { editorState } = this.state;

    return (
      <div className="HtmlEditor">
        {label && <label className="HtmlEditor__label">{label}</label>}
        <Editor
          editorState={editorState}
          wrapperClassName="HtmlEditor__wrapper"
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}

export default HtmlEditor;
