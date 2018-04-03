import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ButtonSelect from '../ButtonSelect';
import permissions from '../../config/permissions';
import PermissionContent from '../PermissionContent';

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

  handleOutsideClick = () => {
    this.setState({ showAutoComplete: false });
  };

  handleSelect = (value) => {
    this.handleToggleAutoComplete(() => {
      this.props.onAdd(value);
    });
  };

  renderTags = tags => tags.map(tag => (
    <div key={`${tag.priority}${tag.label}${tag.id}`} className="btn-group tag-group">
      <span className={`tag-arrow tag-arrow-${tagClassNames[tag.priority]}`} />
      <span className={`btn btn-xs ${valueClassNames[tag.priority]}`}>
        {tag.value}
      </span>
      <If condition={tag.id}>
        <PermissionContent permissions={permissions.USER_PROFILE.DELETE_TAG}>
          <button
            type="button"
            className={`btn btn-xs ${valueClassNames[tag.priority]} btn-del`}
            onClick={() => this.props.onDelete(tag)}
          >
          &times;
          </button>
        </PermissionContent>
      </If>
    </div>
  ));

  renderOption = option => (
    <strong className={optionClassNames[option.priority]}>
      {option.label}
    </strong>
  );

  render() {
    const { showAutoComplete } = this.state;
    const { value, options } = this.props;

    return (
      <div>
        {this.renderTags(value)}

        <PermissionContent permissions={permissions.USER_PROFILE.ADD_TAG}>
          {
            options.length > 0 &&
            <ButtonSelect
              opened={showAutoComplete}
              className="btn btn-add-tag"
              onChange={this.handleSelect}
              onCloseClick={this.handleOutsideClick}
              optionRenderer={this.renderOption}
              options={options}
              onClick={this.handleToggleAutoComplete}
              label={<i className="fa fa-plus-square" id="add-tag-button" />}
              handleClickOutside={this.handleOutsideClick}
              disableClickOutside={!showAutoComplete}
            />
          }
        </PermissionContent>
      </div>
    );
  }
}

ProfileTags.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
  })),
  value: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
ProfileTags.defaultProps = {
  options: [],
  value: [],
};

export default ProfileTags;
