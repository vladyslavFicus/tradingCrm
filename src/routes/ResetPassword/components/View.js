import React, { Component, PropTypes } from 'react';
import { withRouter, IndexLink } from 'react-router';
import { SubmissionError } from 'redux-form';
import ViewForm from './ViewForm';

class SignIn extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  handleSubmit = (data) => {
    return this.props.onSubmit(data)
      .then((action) => {
        if (action) {
          if (!action.error) {
            this.props.router.replace('/');
          } else if (action.error) {
            const _error = action.payload.response.error ?
              action.payload.response.error : action.payload.message;
            throw new SubmissionError({ _error });
          }
        }
      });
  };

  componentWillMount() {
    document.body.classList.add('full-height');
  }

  componentWillUnmount() {
    document.body.classList.remove('full-height');
  }

  render() {
    return <section className="page-content">
      <div className="page-content-inner" style={{ background: '#0e1836' }}>
        <div className="single-page-block-header">
          <div className="row">
            <div className="col-lg-4">
              <div className="logo">
                <IndexLink to='/' className="logo" style={{ fontSize: 32 + 'px' }}>
                  <span style={{ color: '#e7edff' }}>NEW</span>
                  <span style={{ color: 'rgb(26, 122, 175)' }}>AGE</span>
                </IndexLink>
              </div>
            </div>
          </div>
        </div>
        <div className="single-page-block">
          <div className="single-page-block-inner effect-3d-element" ref="innerBlock">
            <h2>Password reset</h2>
            <div className="single-page-block-form">
              <br/>
              <ViewForm
                onSubmit={this.handleSubmit}
              />
            </div>
          </div>
        </div>
        <div className="single-page-block-footer text-center"/>
      </div>
    </section>;
  }
}

export default withRouter(SignIn);

