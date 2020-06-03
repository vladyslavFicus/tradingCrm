import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImageViewer from './ImageViewer';

/**
 * Image viewer HOC to show images in modal
 *
 * @param Component
 *
 * @return {WrappedComponent}
 */
const withImages = (Component) => {
  class WrappedComponent extends PureComponent {
    state = {
      isOpen: false,
      images: [],
    };

    /**
     * Show image modal
     *
     * @param images [{ src: 'https://....' }]
     */
    show = (images) => {
      this.setState({ isOpen: true, images });
    };

    /**
     * Close image modal
     */
    close = () => {
      this.setState({ isOpen: false, images: [] });
    };

    /**
     * Image HOC props
     *
     * @type {{show: WrappedComponent.show, close: WrappedComponent.close}}
     */
    images = {
      show: this.show,
      close: this.close,
    };

    render() {
      const { isOpen, images } = this.state;

      return (
        <>
          <If condition={isOpen}>
            <ImageViewer images={images} onClose={this.close} />
          </If>

          <Component {...this.props} images={this.images} />
        </>
      );
    }
  }

  return WrappedComponent;
};

withImages.propTypes = {
  images: PropTypes.shape({
    show: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  }).isRequired,
};

export default withImages;
