declare module '@mapbox/search-js-react' {
  import { FC, ReactNode } from 'react';

  interface AddressFeature {
    place_name: string;
    geometry: {
      coordinates: [number, number];
    };
  }

  interface AddressAutofillResponse {
    features: AddressFeature[];
  }

  interface AddressAutofillProps {
    accessToken: string;
    children: ReactNode;
    onRetrieve?: (response: AddressAutofillResponse) => void;
    onSuggest?: (response: any) => void;
    onSuggestError?: (error: Error) => void;
    options?: {
      country?: string;
      language?: string;
    };
  }

  export const AddressAutofill: FC<AddressAutofillProps>;
} 