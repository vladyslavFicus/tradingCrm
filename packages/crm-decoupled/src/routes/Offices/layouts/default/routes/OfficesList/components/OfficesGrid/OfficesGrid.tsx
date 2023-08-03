import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import { HierarchyBranch } from '__generated__/types';
import Link from 'components/Link';
import Uuid from 'components/Uuid';
import { Table, Column } from 'components/Table';
import { EditButton, TrashButton } from 'components/Buttons';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import useOfficesGrid from 'routes/Offices/hooks/useOfficesGrid';
import './OfficesGrid.scss';

type Props = {
  loading: boolean,
  officesList: Array<HierarchyBranch>,
  onRefetch: () => void,
};

const OfficesGrid = (props: Props) => {
  const { loading, officesList, onRefetch } = props;

  const {
    isAllowActions,
    isAllowUpdateBranch,
    isAllowDeleteBranch,
    handleEditClick,
    handleDeleteClick,
  } = useOfficesGrid({ onRefetch });

  // ===== Renders ===== //
  const renderOfficeColumn = useCallback(({ name, uuid }: HierarchyBranch) => (
    <>
      <Link
        className="OfficesGrid__cell-primary"
        to={`/offices/${uuid}`}
      >
        {name}
      </Link>

      <div className="OfficesGrid__cell-secondary">
        <Uuid uuid={uuid} uuidPrefix="OF" />
      </div>
    </>
  ), []);

  const renderCountryColumn = useCallback(({ country }: HierarchyBranch) => {
    if (!country) {
      return <span>&mdash;</span>;
    }

    return <CountryLabelWithFlag code={country} height="14" />;
  }, []);


  const renderActions = useCallback((data: HierarchyBranch) => (
    <>
      <If condition={isAllowUpdateBranch}>
        <EditButton
          onClick={() => handleEditClick(data)}
          className="OfficesGrid__edit-button"
          data-testid="OfficesGrid-editButton"
        />
      </If>

      <If condition={isAllowDeleteBranch}>
        <TrashButton
          onClick={() => handleDeleteClick(data)}
          data-testid="OfficesGrid-trashButton"
        />
      </If>
    </>
  ), [isAllowUpdateBranch, isAllowDeleteBranch]);

  return (
    <div className="OfficesGrid">
      <Table
        stickyFromTop={137}
        items={officesList}
        loading={loading}
      >
        <Column
          header={I18n.t('OFFICES.GRID_HEADER.OFFICE')}
          render={renderOfficeColumn}
        />

        <Column
          header={I18n.t('OFFICES.GRID_HEADER.COUNTRY')}
          render={renderCountryColumn}
        />

        <If condition={isAllowActions}>
          <Column
            header={I18n.t('OFFICES.GRID_HEADER.ACTIONS')}
            render={renderActions}
          />
        </If>
      </Table>
    </div>
  );
};

export default React.memo(OfficesGrid);
