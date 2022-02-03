import { useQuery } from 'vue-query';
import { axiosClient } from '~/api/axiosClient';
import { QUERY_KEY } from '~/api/queryKeys';

//====================================
// Choices Enum
//====================================

export enum ACCOMMODATION_STAR {
  'One star' = 1,
  'Two star' = 2,
  'Three star' = 3,
  'Four star' = 4,
  'Five star' = 5,
}

export enum ACCOMMODATION_TYPE {
  'Hotel' = 1,
  'Hostel' = 2,
  'Hotel Chains' = 3,
  'Motel/BnB' = 4,
  'Apartment' = 5,
  'Serviced Apartment' = 6,
  'Guesthouse' = 7,
  'Others' = 8,
}

export enum ACCOMMODATION_CURRENCY {
  'VND' = 1,
  'USD' = 2,
  'Euro' = 3,
}

export enum ACCOMMODATION_POLICY {
  'Checked In' = 1,
  'Checked Out' = 2,
}

export enum BOOKING_METHOD_STATUS {
  'Active' = 1,
  'Inactive' = 2,
}

export enum BOOKING_STATUS {
  'Created' = 1,
  'No Show' = 2,
  'Canceled' = 3,
  'Checked In' = 4,
  'Checked Out' = 5,
  'Undo Checked Out' = 6,
  'Overstay' = 7,
}

export enum BOOKING_HISTORY_TYPE {
  'Created' = 1,
  'Update' = 2,
  'No Show' = 3,
  'Canceled' = 4,
  'Checked In' = 5,
  'Checked Out' = 6,
  'Add Product' = 7,
  'Add Discount' = 8,
  'Add Extra' = 9,
  'Add Payment' = 10,
  'Remove Product' = 11,
  'Remove Discount' = 12,
  'Remove Extra' = 13,
  'Remove Payment' = 14,
  'Undo Checked Out' = 15,
}

export enum PAYMENT_METHOD {
  'Cash' = 1,
  'Card' = 2,
  'Transfer' = 3,
  'OTA Prepaid' = 4,
  'Momo' = 5,
  'Zalo Pay' = 6,
}

export enum DISCOUNT_TYPE {
  'Hotel Discount' = 1,
  'OTA Discount' = 2,
}

export enum STAY_TYPE {
  'Hourly' = 1,
  'Daily' = 2,
  'Overnight' = 3,
}

export enum GENDER {
  'Male' = 1,
  'Female' = 2,
  'Others' = 3,
}

export enum APPLICANT_STATUS {
  'Pending' = 1,
  'Registered' = 2,
  'Rejected' = 3,
}

export enum HOW_TO_KNOW {
  'Internet Search' = 1,
  'Word of Mouth' = 2,
  'Advertisement' = 3,
  'Sales Man' = 4,
  'Others' = 5,
}

export enum ROOM_STATUS {
  'Available' = 1,
  'In use' = 2,
  'Maintenance' = 3,
  'Dirty' = 4,
  'Lock' = 5,
}

export enum DOCUMENT_TYPE {
  'Social ID' = 1,
  'Passport' = 2,
  'Driver license' = 3,
}

export enum GUEST_STATUS {
  'Active' = 1,
  'Banned' = 2,
  'Warning' = 3,
}

export enum GUEST_HISTORY_TYPE {
  'Created' = 1,
  'Updated' = 2,
  'Reserved' = 3,
  'Checked In' = 4,
  'Checked Out' = 5,
  'Canceled' = 6,
  'No Show' = 7,
}

export enum PERMISSION {
  'settings' = 1,
  'room' = 2,
  'inventory' = 3,
  'guest' = 4,
  'booking' = 5,
  'make_a_reservation' = 6,
  'update_room_fee' = 7,
  'update_booking_source' = 8,
  'update_add_guest' = 9,
  'update_remove_guest' = 10,
  'update_add_discount' = 11,
  'update_remove_discount' = 12,
  'check_in' = 13,
  'check_out' = 14,
  'cancel_booking' = 15,
  'no_show_booking' = 16,
  'undo_check_out' = 17,
  'home' = 18,
}
//====================================
// Interfaces & Types
//====================================

export type TUseConstantsQueryResData = [
  {
    module_name: 'accommodation';
    constants: [
      {
        name: 'AccommStar';
        choices: { name: keyof typeof ACCOMMODATION_STAR; value: ACCOMMODATION_STAR }[];
      },
      {
        name: 'AccommType';
        choices: { name: keyof typeof ACCOMMODATION_TYPE; value: ACCOMMODATION_TYPE }[];
      },
      {
        name: 'AccommCurrency';
        choices: { name: keyof typeof ACCOMMODATION_CURRENCY; value: ACCOMMODATION_CURRENCY }[];
      },
      {
        name: 'AccommPolicyType';
        choices: { name: keyof typeof ACCOMMODATION_POLICY; value: ACCOMMODATION_POLICY }[];
      },
      {
        name: 'BookingMethodStatus';
        choices: { name: keyof typeof BOOKING_METHOD_STATUS; value: BOOKING_METHOD_STATUS }[];
      },
    ];
  },
  {
    module_name: 'booking';
    constants: [
      { name: 'Status'; choices: { name: keyof typeof BOOKING_STATUS; value: BOOKING_STATUS }[] },
      {
        name: 'HistoryType';
        choices: { name: keyof typeof BOOKING_HISTORY_TYPE; value: BOOKING_HISTORY_TYPE }[];
      },
      {
        name: 'PaymentMethod';
        choices: { name: keyof typeof PAYMENT_METHOD; value: PAYMENT_METHOD }[];
      },
      {
        name: 'DiscountType';
        choices: { name: keyof typeof DISCOUNT_TYPE; value: DISCOUNT_TYPE }[];
      },
    ];
  },
  {
    module_name: 'general';
    constants: [
      { name: 'StayType'; choices: { name: keyof typeof STAY_TYPE; value: STAY_TYPE }[] },
      { name: 'Gender'; choices: { name: keyof typeof GENDER; value: GENDER }[] },
    ];
  },
  {
    module_name: 'pms_admin';
    constants: [
      {
        name: 'ApplicantStatus';
        choices: { name: keyof typeof APPLICANT_STATUS; value: APPLICANT_STATUS }[];
      },
      { name: 'HowToKnow'; choices: { name: keyof typeof HOW_TO_KNOW; value: HOW_TO_KNOW }[] },
    ];
  },
  {
    module_name: 'room';
    constants: [
      { name: 'RoomStatus'; choices: { name: keyof typeof ROOM_STATUS; value: ROOM_STATUS }[] },
    ];
  },
  {
    module_name: 'guest';
    constants: [
      { name: 'DocType'; choices: { name: keyof typeof DOCUMENT_TYPE; value: DOCUMENT_TYPE }[] },
      { name: 'Status'; choices: { name: keyof typeof GUEST_STATUS; value: GUEST_STATUS }[] },
      {
        name: 'HistoryType';
        choices: { name: keyof typeof GUEST_HISTORY_TYPE; value: GUEST_HISTORY_TYPE }[];
      },
    ];
  },
  {
    module_name: 'permissions';
    constants: [
      { name: 'Module'; choices: { name: keyof typeof PERMISSION; value: PERMISSION }[] },
    ];
  },
];

interface IOptions {
  accommodationStarOptions: { name: keyof typeof ACCOMMODATION_STAR; value: ACCOMMODATION_STAR }[];
  accommodationTypeOptions: { name: keyof typeof ACCOMMODATION_TYPE; value: ACCOMMODATION_TYPE }[];
  accommodationCurrencieOptions: {
    name: keyof typeof ACCOMMODATION_CURRENCY;
    value: ACCOMMODATION_CURRENCY;
  }[];
  accommodationPolicyTypeOptions: {
    name: keyof typeof ACCOMMODATION_POLICY;
    value: ACCOMMODATION_POLICY;
  }[];
  bookingMethodStatusOptions: {
    name: keyof typeof BOOKING_METHOD_STATUS;
    value: BOOKING_METHOD_STATUS;
  }[];
  bookingStatusOptions: { name: keyof typeof BOOKING_STATUS; value: BOOKING_STATUS }[];
  bookingHistoryTypeOptions: {
    name: keyof typeof BOOKING_HISTORY_TYPE;
    value: BOOKING_HISTORY_TYPE;
  }[];
  bookingPaymentMethodOptions: { name: keyof typeof PAYMENT_METHOD; value: PAYMENT_METHOD }[];
  bookingDiscountTypeOptions: { name: keyof typeof DISCOUNT_TYPE; value: DISCOUNT_TYPE }[];
  stayTypeOptions: { name: keyof typeof STAY_TYPE; value: STAY_TYPE }[];
  genderOptions: { name: keyof typeof GENDER; value: GENDER }[];
  applicantStatusOptions: { name: keyof typeof APPLICANT_STATUS; value: APPLICANT_STATUS }[];
  howToKnowOptions: { name: keyof typeof HOW_TO_KNOW; value: HOW_TO_KNOW }[];
  roomStatusOptions: { name: keyof typeof ROOM_STATUS; value: ROOM_STATUS }[];
  documentTypeOptions: { name: keyof typeof DOCUMENT_TYPE; value: DOCUMENT_TYPE }[];
  guestStatusOptions: { name: keyof typeof GUEST_STATUS; value: GUEST_STATUS }[];
  guestHistoryTypeOptions: { name: keyof typeof GUEST_HISTORY_TYPE; value: GUEST_HISTORY_TYPE }[];
  permissionOptions: { name: keyof typeof PERMISSION; value: PERMISSION }[];
}

//====================================
// Fetch Function
//
// This function is very long, but more simple workaround was unable to find.
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<TUseConstantsQueryResData>('/common/constants/get');
  const options: IOptions = {
    accommodationStarOptions: [],
    accommodationTypeOptions: [],
    accommodationCurrencieOptions: [],
    accommodationPolicyTypeOptions: [],
    bookingMethodStatusOptions: [],
    bookingStatusOptions: [],
    bookingHistoryTypeOptions: [],
    bookingPaymentMethodOptions: [],
    bookingDiscountTypeOptions: [],
    stayTypeOptions: [],
    genderOptions: [],
    applicantStatusOptions: [],
    howToKnowOptions: [],
    roomStatusOptions: [],
    documentTypeOptions: [],
    guestStatusOptions: [],
    guestHistoryTypeOptions: [],
    permissionOptions: [],
  };

  data.forEach((datum) => {
    switch (datum.module_name) {
      case 'accommodation':
        datum.constants.forEach((constant) => {
          switch (constant.name) {
            case 'AccommStar':
              options.accommodationStarOptions = [...constant.choices];
              break;
            case 'AccommType':
              options.accommodationTypeOptions = [...constant.choices];
              break;
            case 'AccommCurrency':
              options.accommodationCurrencieOptions = [...constant.choices];
              break;
            case 'AccommPolicyType':
              options.accommodationPolicyTypeOptions = [...constant.choices];
              break;
            case 'BookingMethodStatus':
              options.bookingMethodStatusOptions = [...constant.choices];
              break;
          }
        });
        break;
      case 'booking':
        datum.constants.forEach((constant) => {
          switch (constant.name) {
            case 'PaymentMethod':
              options.bookingPaymentMethodOptions = [...constant.choices];
              break;
            case 'DiscountType':
              options.bookingDiscountTypeOptions = [...constant.choices];
              break;
            case 'HistoryType':
              options.bookingHistoryTypeOptions = [...constant.choices];
              break;
            case 'Status':
              options.bookingStatusOptions = [...constant.choices];
              break;
          }
        });
        break;
      case 'general':
        datum.constants.forEach((constant) => {
          switch (constant.name) {
            case 'StayType':
              options.stayTypeOptions = [...constant.choices];
              break;
            case 'Gender':
              options.genderOptions = [...constant.choices];
              break;
          }
        });
        break;
      case 'guest':
        datum.constants.forEach((constant) => {
          switch (constant.name) {
            case 'HistoryType':
              options.guestHistoryTypeOptions = [...constant.choices];
              break;
            case 'DocType':
              options.documentTypeOptions = [...constant.choices];
              break;
            case 'Status':
              options.guestStatusOptions = [...constant.choices];
              break;
          }
        });
        break;
      case 'permissions':
        datum.constants.forEach((constant) => {
          switch (constant.name) {
            case 'Module':
              options.permissionOptions = [...constant.choices];
              break;
          }
        });
        break;
      case 'pms_admin':
        datum.constants.forEach((constant) => {
          switch (constant.name) {
            case 'ApplicantStatus':
              options.applicantStatusOptions = [...constant.choices];
              break;
            case 'HowToKnow':
              options.howToKnowOptions = [...constant.choices];
              break;
          }
        });
        break;
      case 'room':
        datum.constants.forEach((constant) => {
          switch (constant.name) {
            case 'RoomStatus':
              options.roomStatusOptions = [...constant.choices];
              break;
          }
        });
        break;
    }
  });

  return options;
};

//====================================
// MAIN FUNCTION
//====================================

export const useConstantsQuery = () => {
  const useQueryResult = useQuery(QUERY_KEY.CONSTANTS, fetchFn);

  const getAccCurrencyName = (value?: number) =>
    useQueryResult.data.value?.accommodationCurrencieOptions.find(
      (option) => option.value === value,
    )?.name ?? 'USD';

  return { ...useQueryResult, getAccCurrencyName };
};
