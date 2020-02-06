/* eslint-disable */

import React, { PureComponent, Fragment } from 'react';
import { get } from 'lodash';
import moment from 'moment';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { graphql, compose } from 'react-apollo';
import { getApiRoot } from 'config';
import { withStorage } from 'providers/StorageProvider';
import { withNotifications } from 'components/HighOrder';
import downloadBlob from 'utils/downloadBlob';
import PropTypes from 'constants/propTypes';
import fetch from 'utils/fetch';
import { changeStatusMutation } from 'graphql/mutations/questionnaire';
import { statusColors } from './constants';

class Questionnaire extends PureComponent {
  static propTypes = {
    questionnaireLastData: PropTypes.shape({
      questionnaire: PropTypes.shape({
        lastProfileData: PropTypes.shape({
          data: PropTypes.questionnaireLastData,
        }),
      }),
    }).isRequired,
    profileUUID: PropTypes.string,
    changeStatus: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  static defaultProps = {
    profileUUID: null,
  };

  /**
   * Change questionnaire status handler
   *
   * @param status
   *
   * @return {Function}
   */
  handleChangeStatus = status => async () => {
    const {
      notify,
      changeStatus,
      questionnaireLastData: {
        refetch,
        questionnaire: questionnaireResponse,
      },
    } = this.props;

    const questionnaireUUID = get(questionnaireResponse, 'lastProfileData.data.uuid');

    const {
      data: {
        questionnaire: {
          changeStatus: {
            success,
          },
        },
      },
    } = await changeStatus({ variables: { questionnaireUUID, status } });

    notify({
      level: success ? 'success' : 'error',
      title: I18n.t('CLIENT_PROFILE.CLIENT.QUESTIONNAIRE.TITLE'),
      message: success
        ? I18n.t('CLIENT_PROFILE.CLIENT.QUESTIONNAIRE.STATUS_CHANGED')
        : I18n.t('COMMON.SOMETHING_WRONG'),
    });

    if (success) {
      refetch();
    }
  };

  /**
   * Create link and download questionnaire PDF
   *
   * @param e
   *
   * @return {Promise<void>}
   */
  downloadPdf = async (e) => {
    e.stopPropagation();

    const { profileUUID, token } = this.props;

    const requestUrl = `${getApiRoot()}/questionnaire/pdf/${profileUUID}`;

    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/pdf',
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const blobData = await response.blob();

    downloadBlob(`${profileUUID}.pdf`, blobData);
  };

  renderLabel = questionnaire => (
    <div className="header-block">
      <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.QUESTIONNAIRE.TITLE')}</div>
      <div className="header-block-middle">
        <span className={classNames('text-uppercase', statusColors[questionnaire.status])}>
          {I18n.t(`CLIENT_PROFILE.CLIENT.QUESTIONNAIRE.STATUSES.${questionnaire.status}`)}
        </span>
      </div>
      <div className="header-block-small">
        <div>
          <span>{I18n.t('COMMON.ON')} {moment.utc(questionnaire.updatedAt).local().format('DD.MM.YYYY HH:mm')}</span>
        </div>
        <div>
          <span>{I18n.t('CLIENT_PROFILE.CLIENT.QUESTIONNAIRE.VERSION')}: {questionnaire.version}</span>
        </div>
        <div>
          <span>{I18n.t('CLIENT_PROFILE.CLIENT.QUESTIONNAIRE.SCORE')}: {questionnaire.score}</span>
        </div>
        <div className="margin-top-10">
          <button type="button" className="header-block_questionnaire_link" onClick={this.downloadPdf}>
            <i className="fa-download" /> {I18n.t('CLIENT_PROFILE.CLIENT.QUESTIONNAIRE.DOWNLOAD_PDF')}
          </button>
        </div>
      </div>
    </div>
  );

  render() {
    const {
      questionnaireLastData: {
        questionnaire: questionnaireResponse,
      },
    } = this.props;

    const questionnaire = get(questionnaireResponse, 'lastProfileData.data');
    const error = get(questionnaireResponse, 'lastProfileData.error.error');

    return (
      <div className="header-block header-block-inner header-block_questionnaire">
        {/* Render "NOT PASSED" status if questionnaire form not found on backend */}
        <If condition={!questionnaire && error === 'error.entity.not.found'}>
          <Fragment>
            <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.QUESTIONNAIRE.TITLE')}</div>
            <div className="header-block-middle">
              <span className="color-inactive text-uppercase">
                {I18n.t('CLIENT_PROFILE.CLIENT.QUESTIONNAIRE.STATUSES.NOT_PASSED')}
              </span>
            </div>
          </Fragment>
        </If>
        <If condition={questionnaire}>
          {this.renderLabel(questionnaire)}
        </If>
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withStorage(['token']),
  graphql(changeStatusMutation, {
    name: 'changeStatus',
  }),
)(Questionnaire);
