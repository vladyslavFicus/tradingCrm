import { useLocation, useNavigate } from 'react-router-dom';
import I18n from 'i18n-js';
import { useCallback, useMemo } from 'react';
import { Utils } from '@crm/common';
import { State } from 'types';
import { ResetForm } from 'types/formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import { typesLabels } from 'constants/audit';
import { FeedsQueryVariables } from '../graphql/__generated__/FeedsQuery';
import { useFeedTypesQuery } from '../graphql/__generated__/FeedTypesQuery';

type FormValues = {
  searchBy?: string,
  auditLogType?: string,
  creationDateFrom?: string,
  creationDateTo?: string,
};

type Props = {
  targetUUID: string,
  skipCategoryFilter: boolean,
  auditCategory?: FeedAuditCategoryEnum,
};

const useFeedsFilters = (props: Props) => {
  const { targetUUID, skipCategoryFilter, auditCategory } = props;

  const state = useLocation().state as State<FeedsQueryVariables>;
  const initialValues = state?.filters as FormValues || {};

  const navigate = useNavigate();

  // ===== Requests ===== //
  const feedTypesQuery = useFeedTypesQuery({
    variables: {
      uuid: targetUUID,
      filters: {
        ...(auditCategory && { auditCategory }),
      },
    },
    skip: skipCategoryFilter,
  });

  const feedTypesList = feedTypesQuery.data?.feedTypes || {};

  const availableTypes = useMemo(() => Object.keys(feedTypesList)
    .filter(key => feedTypesList[key] && key !== '__typename')
    .map(type => ({
      key: type,
      value: I18n.t(Utils.renderLabel(type, typesLabels)),
    }))
    .sort(({ value: a }, { value: b }) => (a > b ? 1 : -1)),
  [feedTypesList]);

  // ===== Handlers ===== //
  const handleSubmit = useCallback((values: FormValues) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  }, [state]);

  const handleReset = useCallback((resetForm: ResetForm<FormValues>) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm();
  }, [state]);

  return {
    initialValues,
    feedTypesList,
    availableTypes,
    handleSubmit,
    handleReset,
  };
};

export default useFeedsFilters;
