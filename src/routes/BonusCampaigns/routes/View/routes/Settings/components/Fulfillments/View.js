import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import _ from 'lodash';
import { SelectField } from '../../../../../../../../components/ReduxForm';
import DepositFulfillment from './DepositFulfillment';
import DefaultFulfillment from './DefaultFulfillment';
import renderLabel from '../../../../../../../../utils/renderLabel';
import deleteFromArray from '../../../../../../../../utils/deleteFromArray';
import attributeLabels from './constants';
import { fulfillmentSelect } from '../../../../../../../../constants/bonus-campaigns';

const FULFILLMENTS = ['deposit', 'profileCompleted'];

class View extends Component {
  state = {
    activeFulfillments: [],
    selectedFulfillment: 'deposit',
  };

  handleAddFulfillment = () => {
    const { activeFulfillments, selectedFulfillment } = this.state;
    this.setState({
      activeFulfillments: [
        ...activeFulfillments,
        selectedFulfillment,
      ],
    }, this.handleRefreshActiveFulfillment);
  }

  handleRemoveFulfillment = (value) => {
    this.setState({
      activeFulfillments: deleteFromArray(this.state.activeFulfillments, value),
    }, this.handleRefreshActiveFulfillment);
  }

  handleRefreshActiveFulfillment = () => {
    const availableFulfillment = _.difference(FULFILLMENTS, this.state.activeFulfillments);
    if (availableFulfillment.length > 0) {
      this.handleSelectFulfillment(availableFulfillment[0]);
    }
  }

  handleSelectFulfillment = (value) => {
    this.setState({
      selectedFulfillment: value,
    });
  }

  render() {
    const { toggleModal, disabled } = this.props;
    const { activeFulfillments, selectedFulfillment } = this.state;

    const availableFulfillments = _.difference(FULFILLMENTS, activeFulfillments);

    return (
      <div className="col-lg-6 padding-bottom-30 with-right-border">
        {
          activeFulfillments.indexOf('deposit') > -1 &&
          <DepositFulfillment
            label={I18n.t(attributeLabels.depositFulfillment)}
            modalOpen={toggleModal}
            remove={() => this.handleRemoveFulfillment('deposit')}
          />
        }
        {
          activeFulfillments.indexOf('profileCompleted') > -1 &&
          <DefaultFulfillment
            label={I18n.t(attributeLabels.profileCompleted)}
            modalOpen={toggleModal}
            remove={() => this.handleRemoveFulfillment('profileCompleted')}
          />
        }
        {
          availableFulfillments.length > 0 &&
          <div className="add-campaign-setting col-md-12">
            <div className="col-md-6">
              <SelectField
                label=""
                position="vertical"
                labelClassName="no-label"
                disabled={disabled}
                input={{
                  value: selectedFulfillment,
                  onChange: e => this.handleSelectFulfillment(e.target.value),
                }}
              >
                {
                  availableFulfillments.map(key => (
                    <option key={key} value={key}>
                      {renderLabel(key, fulfillmentSelect)}
                    </option>
                  ))
                }
              </SelectField>
            </div>

            <button
              type="button"
              className="btn"
              onClick={this.handleAddFulfillment}
            >
              {I18n.t(attributeLabels.addFulfillment)}
            </button>
          </div>
        }
      </div>
    );
  }
}

export default View;
