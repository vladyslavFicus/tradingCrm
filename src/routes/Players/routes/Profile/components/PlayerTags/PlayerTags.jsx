import React, { Component } from 'react';
import { get } from 'lodash';
import PropTypes from '../../../../../../constants/propTypes';
import MultiInput from '../../../../../../components/MultiInput';

class PlayerTags extends Component {
  static propTypes = {
    unlinkTag: PropTypes.func.isRequired,
    createOrLinkTag: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    playerTags: PropTypes.shape({
      playerTags: PropTypes.shape({
        content: PropTypes.arrayOf(PropTypes.shape({
          tagId: PropTypes.string,
          tagName: PropTypes.string,
        })),
      }),
    }),
  };

  static defaultProps = {
    playerTags: {},
  };

  onAdd = async (value) => {
    const {
      createOrLinkTag,
      match: { params: { id } },
    } = this.props;

    const response = await createOrLinkTag({
      variables: { tagName: value, targetUUID: id, pinned: true },
    });

    const error = get(response, 'data.tag.createOrLink.error');
    const tagId = get(response, 'data.tag.createOrLink.data.0.tagId', null);

    return {
      success: !error,
      id: tagId,
    };
  };

  onRemove = async (value) => {
    const {
      unlinkTag,
      match: { params: { id } },
    } = this.props;

    const response = await unlinkTag({
      variables: { tagId: value, targetUUID: id },
    });

    return {
      success: get(response, 'data.tag.unlink.success'),
    };
  };

  render() {
    const { playerTags } = this.props;

    const loading = get(playerTags, 'loading');

    if (loading) {
      return null;
    }

    const tags = get(playerTags, 'playerTags.content', []);

    return (
      <MultiInput
        components={{ DropdownIndicator: null, ClearIndicator: null }}
        async
        onAdd={this.onAdd}
        onRemove={this.onRemove}
        initialValues={tags.map(t => ({ label: t.tagName, value: t.tagId }))}
      />
    );
  }
}

export default PlayerTags;
