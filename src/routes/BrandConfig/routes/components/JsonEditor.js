import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/twilight';

class JsonEditor extends PureComponent {
  static propTypes = {
    value: PropTypes.object,
  };

  static defaultProps = {
    value: null,
  };

  componentDidMount() {
    const ctx = this.editor.jsonEditor.aceEditor;

    ctx.setFontSize(14);

    ctx.setOptions({
      maxLines: Infinity,
      showFoldWidgets: false,
    });
  }

  componentDidUpdate({ value }) {
    if (!isEqual(value, this.props.value)) {
      this.setValue(this.props.value);
    }
  }

  getValue = () => this.editor.jsonEditor.get();

  setValue = value => this.editor.jsonEditor.set(value);

  render() {
    return (
      <Editor
        ace={ace}
        mode="code"
        theme="ace/theme/twilight"
        value={this.props.value}
        ref={(editor) => { this.editor = editor; }}
      />
    );
  }
}

export default JsonEditor;
