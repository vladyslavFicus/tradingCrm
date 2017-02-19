import React, { PureComponent, PropTypes } from 'react';
import ButtonSelect from 'components/ButtonSelect';

const optionClassNames = {
  negative: 'text-danger',
  positive: 'text-success',
  neutral: 'text-default',
};
const valueClassNames = {
  negative: 'btn-danger',
  positive: 'btn-success',
  neutral: 'btn-default',
};

class ProfileTags extends PureComponent {
  state = {
    showAutoComplete: false,
  };

  handleToggleAutoComplete = (callback) => {
    this.setState({
      showAutoComplete: !this.state.showAutoComplete,
    }, () => {
      if (typeof callback === 'function') {
        callback(this.state);
      }
    });
  };

  handleOutsideClick = (e) => {
    this.setState({ showAutoComplete: false });
  };

  handleSelect = (value) => {
    this.handleToggleAutoComplete(() => {
      this.props.onSelectValue(value);
    });
  };

  renderTags = (tags) => {
    return tags.map(tag => (
      <div key={tag.id} className="btn-group margin-inline">
        <button
          type="button"
          className={`btn btn-xs btn-secondary ${valueClassNames[tag.priority]}`}
          onClick={(e) => this.props.onDeleteValue(tag)}
        >&times;</button>
        <span className={`btn btn-xs btn-secondary ${valueClassNames[tag.priority]}`}>
        {tag.value}
        </span>
      </div>
    ));
  };

  renderOption = (option) => {
    return <strong className={optionClassNames[option.priority]}>
      {option.label}
    </strong>
  };

  render() {
    const { showAutoComplete } = this.state;
    const { value, options } = this.props;

    return <div>
      {this.renderTags(value)}

      <ButtonSelect
        opened={showAutoComplete}
        className="btn btn-xs btn-default font-size-14 margin-inline"
        onChange={this.handleSelect}
        optionRenderer={this.renderOption}
        options={options}
        onClick={this.handleToggleAutoComplete}
        label={<i className="fa fa-plus-square"/>}
        handleClickOutside={this.handleOutsideClick}
        disableClickOutside={!showAutoComplete}
      />
    </div>;
  }
}

ProfileTags.propTypes = {
  onSelectValue: PropTypes.func.isRequired,
  onDeleteValue: PropTypes.func.isRequired,
};

export default ProfileTags;
