import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';

class OperatorGridFilter extends Component {
  handleSubmit = () => {
    console.log('implement handleSubmit');
  };

  render() {
    const {
      submitting,
      handleSubmit,
      reset,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <div className="row margin-bottom-20">
          <div className="col-md-3">
            <span className="font-size-20">Operators</span>
          </div>
        </div>

        <div className="well">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-3"></div>
                <div className="col-md-3"></div>
                <div className="col-md-3"></div>
              </div>
              <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-3"></div>
                <div className="col-md-3"></div>
                <div className="col-md-3">
                  <div className="form-group">
                    <br/>
                    <button
                      disabled={submitting}
                      className="btn btn-default btn-sm margin-inline font-weight-700"
                      onClick={reset}
                    >
                      Reset
                    </button>
                    {' '}
                    <button
                      disabled={submitting}
                      className="btn btn-primary btn-sm margin-inline font-weight-700"
                      type="submit"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'operatorsListGridFilter',
})(OperatorGridFilter);
