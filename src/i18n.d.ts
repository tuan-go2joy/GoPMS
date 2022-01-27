/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { DefineLocaleMessage, DefineDateTimeFormat, DefineNumberFormat } from 'vue-i18n';
import { TMessageSchema } from '~/plugins/i18n';

declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends TMessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {
    // short: {
    //   hour: 'numeric';
    //   minute: 'numeric';
    //   second: 'numeric';
    //   timeZoneName: 'short';
    //   timezone: string;
    // };
  }

  // define the number format schema
  export interface DefineNumberFormat {
    //     currency: {
    //       style: 'currency';
    //       currencyDisplay: 'symbol';
    //       currency: string;
    //     };
    //   }
  }
}
