import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-images';

class ImageViewer extends PureComponent {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
      source: PropTypes.string,
    })).isRequired,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    onClose: () => {},
  };

  render() {
    const { images, onClose } = this.props;

    return (
      <Lightbox
        isOpen
        backdropClosesModal
        showImageCount={false}
        images={images}
        onClose={onClose}
      />
    );
  }
}

export default ImageViewer;
