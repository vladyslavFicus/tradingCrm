import React, { useState, useEffect, useCallback } from 'react';
import { Config } from '@crm/common';
import Preloader from 'components/Preloader';
import { importLink } from 'utils/dom';
import { addCRMCustomLocale } from 'utils/locale';
import { downloadLocalesFromS3 } from './utils';
import './CrmBrandProvider.scss';

type Props = {
  children: React.ReactNode,
};

enum BrandStatusesEnum {
  LOADING,
  SUCCESS,
  ERROR,
}

/**
 * Get config from CRM brand config on S3 if it exists
 *
 * @param props
 *
 * @constructor
 */
const CrmBrandProvider = (props: Props) => {
  const [brandStatus, setBrandStatus] = useState<BrandStatusesEnum>(BrandStatusesEnum.LOADING);

  // ================== Download CRM brand config ================== //
  const getCrmBrandConfig = useCallback(async () => {
    const response = await fetch(Config.getCrmBrandStaticFileUrl('config.json'));

    if (response.status === 200) {
      const data = await response.json();

      Config.config.backofficeBrand = { ...data, ...Config.config.backofficeBrand };

      return data;
    }

    return null;
  }, []);

  // ================== Download CRM brand locales ================== //
  const downloadCrmBrandLocales = useCallback(async (localeKeys: Array<string>) => {
    const locales = await downloadLocalesFromS3(localeKeys);

    // Add custom locales from CRM brand to system
    Object.keys(locales).forEach(localeKey => addCRMCustomLocale(localeKey, locales[localeKey]));
  }, []);

  // ================== Download CRM brand styles ================== //
  const downloadStyles = useCallback(async () => {
    await importLink({
      rel: 'stylesheet',
      href: Config.getCrmBrandStaticFileUrl('assets/style.css'),
    });
  }, []);

  // ================== Download CRM brand icon pack ================== //
  const downloadIconpack = useCallback(async () => {
    await importLink({
      rel: 'stylesheet',
      href: Config.getCrmBrandStaticFileUrl('assets/iconpack/style.css'),
    });
  }, []);


  // ================== Download all necessary assets ================== //
  useEffect(() => {
    (async () => {
      const crmBrandConfig = await getCrmBrandConfig();

      // Download all next assets if crm brand config exists
      if (crmBrandConfig) {
        await Promise.allSettled([
          downloadCrmBrandLocales(crmBrandConfig.locales),
          downloadStyles(),
          downloadIconpack(),
        ]);

        setBrandStatus(BrandStatusesEnum.SUCCESS);
      } else {
        setBrandStatus(BrandStatusesEnum.ERROR);
      }
    })();
  }, []);

  return (
    <Choose>
      <When condition={brandStatus === BrandStatusesEnum.LOADING}>
        <Preloader />
      </When>
      <When condition={brandStatus === BrandStatusesEnum.SUCCESS}>
        {props.children}
      </When>
      <Otherwise>
        <div className="CrmBrandProvider">
          <div className="CrmBrandProvider__text">
            CRM Setup Required
            <hr />
          </div>
          <div className="CrmBrandProvider__subtext">
            Please contact support
          </div>
        </div>
      </Otherwise>
    </Choose>
  );
};

export default React.memo(CrmBrandProvider);
