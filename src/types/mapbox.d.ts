declare module '@mapbox/search-js-react' {
  import { FC, ReactNode } from 'react';

  interface AddressAutofillProps {
    accessToken: string;
    children: ReactNode;
  }

  export const AddressAutofill: FC<AddressAutofillProps>;
} 