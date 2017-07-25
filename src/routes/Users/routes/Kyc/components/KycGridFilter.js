import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { reduxForm, Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { createValidator } from '../../../../../utils/validator';
import { filterLabels } from '../../../../../constants/kyc';
import { DateTimeField } from '../../../../../components/ReduxForm';

const validator = createValidator({
  from: 'string',
  to: 'string',
  status: 'string',
}, filterLabels, false);

class KycGridFilter extends Component {
  static propTypes = {
    filterValues: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
      status: PropTypes.string,
    }).isRequired,
    submitting: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };
  static defaultProps = {
    filterValues: {
      from: '',
      to: '',
      status: '',
    },
  };

  startDateValidator = toAttribute => (current) => {
    const { filterValues } = this.props;

    return filterValues[toAttribute]
      ? current.isSameOrBefore(moment(filterValues[toAttribute]))
      : true;
  };

  endDateValidator = fromAttribute => (current) => {
    const { filterValues } = this.props;

    return filterValues[fromAttribute]
      ? current.isSameOrAfter(moment(filterValues[fromAttribute]))
      : true;
  };

  handleReset = () => {
    this.props.reset();
    this.props.onReset();
  };

  render() {
    const {
      submitting,
      pristine,
      handleSubmit,
      onSubmit,
    } = this.props;

    return (
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="well">
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-5">
                    <div className="form-group">
                      <label className="form-label">
                        {I18n.t('KYC_REQUESTS.FILTER.DATE_RANGE')}
                      </label>
                      <div className="row">
                        <div className="col-md-5">
                          <Field
                            name="from"
                            placeholder={I18n.t(filterLabels.from)}
                            component={DateTimeField}
                            position="vertical"
                            isValidDate={this.endDateValidator('to')}
                          />
                        </div>
                        <div className="col-md-5">
                          <Field
                            name="to"
                            placeholder={I18n.t(filterLabels.to)}
                            component={DateTimeField}
                            position="vertical"
                            isValidDate={this.endDateValidator('from')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <button
                        disabled={submitting || pristine}
                        className="btn btn-default btn-sm margin-inline font-weight-700"
                        onClick={this.handleReset}
                        type="reset"
                      >
                        Reset
                      </button>
                      <button
                        disabled={submitting || pristine}
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
      </div>
    );
  }
}

export default reduxForm({
  form: 'kycRequestsGridFilter',
  validate: validator,
})(KycGridFilter);
