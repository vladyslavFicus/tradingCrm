import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import { Formik, Form } from 'formik';
import PropTypes from 'constants/propTypes';
import { FormikDateRangeGroup } from 'components/Formik';
import { Button } from 'components/UI';
import './LeadNotesTabFilter.scss';

class LeadNotesTabFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
  };

  handleSubmit = (filters) => {
    this.props.history.replace({ query: { filters } });
  };

  handleReset = () => {
    this.props.history.replace({ query: { filters: {} } });
  };

  render() {
    const { location: { query } } = this.props;

    return (
      <Formik
        initialValues={query?.filters || {}}
        onSubmit={this.handleSubmit}
        enableReinitialize
      >
        {({ dirty }) => (
          <Form className="LeadNotesTabFilter">
            <FormikDateRangeGroup
              className="LeadNotesTabFilter__field LeadNotesTabFilter__date-range"
              label={I18n.t('LEAD_PROFILE.NOTES.FILTER.LABELS.CREATION_DATE_RANGE')}
              periodKeys={{
                start: 'changedAtFrom',
                end: 'changedAtTo',
              }}
              withFocus
            />
            <div className="LeadNotesTabFilter__buttons">
              <Button
                className="LeadNotesTabFilter__button"
                onClick={this.handleReset}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                className="LeadNotesTabFilter__button"
                type="submit"
                primary
                disabled={!dirty}
              >
                {I18n.t('COMMON.APPLY')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default withRouter(LeadNotesTabFilter);
