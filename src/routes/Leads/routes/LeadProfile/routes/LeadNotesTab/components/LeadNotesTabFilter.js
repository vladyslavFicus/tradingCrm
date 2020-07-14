import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Formik, Form } from 'formik';
import { FormikDateRangePicker } from 'components/Formik';
import Button from 'components/UI/Button';
import './LeadNotesTabFilter.scss';

class LeadNotesTabFilter extends PureComponent {
  static propTypes = {
    handleApplyFilters: PropTypes.func.isRequired,
  };

  render() {
    const { handleApplyFilters } = this.props;

    return (
      <Formik
        initialValues={{
          changedAtFrom: '',
          changedAtTo: '',
        }}
        onSubmit={handleApplyFilters}
        onReset={handleApplyFilters}
      >
        {({ dirty, handleReset }) => (
          <Form className="LeadNotesTabFilter">
            <FormikDateRangePicker
              className="LeadNotesTabFilter__field"
              label={I18n.t('LEAD_PROFILE.NOTES.FILTER.LABELS.CREATION_DATE_RANGE')}
              periodKeys={{
                start: 'changedAtFrom',
                end: 'changedAtTo',
              }}
              anchorDirection="left"
            />
            <div className="LeadNotesTabFilter__button-group">
              <Button
                className="LeadNotesTabFilter__button"
                onClick={handleReset}
                disabled={!dirty}
                common
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

export default LeadNotesTabFilter;
