import React, { Component, PropTypes } from 'react';
import { statuses as kysStatuses } from 'constants/kyc';
import RefuseModal from './RefuseModal';

const initialState = {
  modal: {
    show: false,
  },
};

class VerifyIdentity extends Component {
  state = initialState;

  static propTypes = {
    status: PropTypes.shape({
      value: PropTypes.string,
      editDate: PropTypes.string,
      author: PropTypes.string,
      reason: PropTypes.string,
      comment: PropTypes.string
    }),
    profile: PropTypes.shape({
      initials: PropTypes.string,
      language: PropTypes.string,
    }),
    onVerifyIdentity: PropTypes.func.isRequired,
    onRefuseIdentity: PropTypes.func.isRequired,
  };

  handleOpenModal = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      modal: {
        show: true
      }
    });
  };

  handleCloseModal = (e, callback) => {
    this.setState(initialState, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  handleRefuseIdentity = data => {
    return this.props.onRefuseIdentity(data)
      .then(() => this.handleCloseModal());
  };

  render() {
    const { status: { value: status }, onVerifyIdentity, profile } = this.props;
    const { modal } = this.state;

    return (
      <div>
        {
          status !== kysStatuses.VERIFY &&
            <div>
              <div className="h5 color-warning">
                <i className="fa fa-exclamation-triangle"></i> Identity not verified
              </div>
              <div className="padding-bottom-20">
                In order to get verified we require at least one valid proof of Identification.
                The ID or Passport scan need to be sharp with clear picture, readable and not expired or damaged.
              </div>

              <div>
                <button
                  onClick={(e) => this.handleOpenModal(e)}
                  type="button"
                  className="btn btn-danger-outline margin-inline"
                >Refuse</button>
                <button
                  onClick={onVerifyIdentity}
                  type="button"
                  className="btn btn-success-outline margin-inline"
                >Verify identity</button>
              </div>
            </div>
        }

        {
          status === kysStatuses.VERIFY &&
          <div>
            <div className="h5 color-success">
              <i className="fa fa-check-circle-o"></i> Identity verified
            </div>

            <div className="padding-bottom-20">
              by Operator UID-14 on 20.10.2016 at 12:45
            </div>

            <button
              onClick={(e) => this.handleOpenModal(e)}
              type="button"
              className="btn btn-danger-outline margin-inline"
            >Revoke</button>
          </div>
        }

        <RefuseModal
          profile={profile}
          isOpen={modal.show}
          onSubmit={this.handleRefuseIdentity}
          onClose={this.handleCloseModal}
        />
      </div>
    );
  }
}

export default VerifyIdentity;
