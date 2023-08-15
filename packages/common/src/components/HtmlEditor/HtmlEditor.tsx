import React, { useEffect, useState } from 'react';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './HtmlEditor.scss';

type Props = {
  label?: string,
  value: string,
  onChange: (html: string) => void,
  error: string | boolean| Array<string>,
};

const HtmlEditor = (props: Props) => {
  const { label, value, onChange, error } = props;

  const initialState = EditorState.createEmpty();

  const [editorState, setEditorState] = useState<EditorState>(initialState);

  const setCorrectIcons = () => {
    document.querySelectorAll('.HtmlEditor .rdw-option-wrapper img').forEach((item) => {
      // All the icons that are set via <img src=''> in the HtmlEditor,
      // we loop through them and extract the base64 code from the src="..." attribute, then convert it to a plain <svg>
      const svg = item.getAttribute('src');
      const parent = item.parentNode;
      const base64 = 'data:image/svg+xml;base64,';

      if (svg?.includes(base64) === true) {
        const replaceSvg = svg?.slice(base64.length).replace(/[=]/g, '');
        const convertToSvg = window.atob(replaceSvg);
        const newStrObject = new DOMParser().parseFromString(convertToSvg, 'text/xml');
        const newSvg = newStrObject.getElementsByTagName('svg')[0];

        parent?.append(newSvg);
      }
    });
  };

  const getStateWithContent = () => {
    const blocksFromHtml = htmlToDraft(props.value);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const editorStateContent = EditorState.createWithContent(contentState);

    setEditorState(editorStateContent);
  };

  useEffect(() => {
    setCorrectIcons();

    if (value) {
      getStateWithContent();
    }
  }, []);

  useEffect(() => {
    const currentValue = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    if (value === '' && currentValue !== '') {
      setEditorState(initialState);
    }
  }, [value]);

  const onEditorStateChange = (newEditorState: EditorState) => {
    const html = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));

    onChange(html);

    setEditorState(newEditorState);
  };

  return (
    <div className="HtmlEditor">
      {label && <label className="HtmlEditor__label">{label}</label>}
      <Editor
        editorState={editorState}
        wrapperClassName="HtmlEditor__wrapper"
        onEditorStateChange={onEditorStateChange}
      />

      <If condition={!!error}>
        <div className="HtmlEditor__error">
          <i className="HtmlEditor__error-icon icon-alert" />
          {error}
        </div>
      </If>
    </div>
  );
};

export default React.memo(HtmlEditor);
