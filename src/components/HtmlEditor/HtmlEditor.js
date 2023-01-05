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
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.string),
    ]),
  };

  static defaultProps = {
    label: null,
    value: null,
    onChange: () => {},
    error: null,
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

  componentDidMount() {
    document.querySelectorAll('.HtmlEditor .rdw-option-wrapper img').forEach((item) => {
      // All the icons that are set via <img src=''> in the HtmlEditor,
      // we loop through them and extract the base64 code from the src="..." attribute, then convert it to a plain <svg>
      const svg = item.getAttribute('src');
      const parent = item.parentNode;
      const base64 = 'data:image/svg+xml;base64,';

      if (svg.includes(base64) === true) {
        const replaceSvg = svg.slice(base64.length).replace(/[=]/g, '');
        const convertToSvg = window.atob(replaceSvg);
        const newStrObject = new DOMParser().parseFromString(convertToSvg, 'text/xml');
        const newSvg = newStrObject.getElementsByTagName('svg')[0];

        parent.append(newSvg);
      }
    });
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
    const { label, error } = this.props;
    const { editorState } = this.state;

    return (
      <div className="HtmlEditor">
        {label && <label className="HtmlEditor__label">{label}</label>}
        <Editor
          editorState={editorState}
          wrapperClassName="HtmlEditor__wrapper"
          onEditorStateChange={this.onEditorStateChange}
        />

        <If condition={error}>
          <div className="HtmlEditor__footer">
            <div className="HtmlEditor__error">
              <i className="HtmlEditor__error-icon icon-alert" />
              {error}
            </div>
          </div>
        </If>
      </div>
    );
  }
}

export default HtmlEditor;
