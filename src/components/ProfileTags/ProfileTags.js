import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ButtonSelect from 'components/ButtonSelect';

const optionClassNames = {
  negative: 'text-danger',
  positive: 'text-success',
  neutral: 'text-default',
};
const valueClassNames = {
  negative: 'tag-red',
  positive: 'tag-green',
  neutral: 'tag-grey',
};
const tagClassNames = {
  negative: 'danger',
  positive: 'success',
  neutral: 'default',
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
      this.props.onAdd(value);
    });
  };

  renderTags = (tags) => {
    return tags.map(tag => (
      <div key={tag.id} className="btn-group tag-group">
        <span className={`tag-arrow tag-arrow-${tagClassNames[tag.priority]}`} />
        <span className={`btn btn-xs ${valueClassNames[tag.priority]}`}>
          {tag.value}
        </span>
        <button
          type="button"
          className={`btn btn-xs ${valueClassNames[tag.priority]} btn-del`}
          onClick={(e) => this.props.onDelete(tag)}
        >&times;</button>
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

      {options.length > 0 && <ButtonSelect
        opened={showAutoComplete}
        className="btn btn-xs btn-default"
        onChange={this.handleSelect}
        onCloseClick={this.handleOutsideClick}
        optionRenderer={this.renderOption}
        options={options}
        onClick={this.handleToggleAutoComplete}
        label={<i className="fa fa-plus-square" />}
        handleClickOutside={this.handleOutsideClick}
        disableClickOutside={!showAutoComplete}
      />}
    </div>;
  }
}

ProfileTags.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProfileTags;
