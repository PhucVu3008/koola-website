'use client';

import PhoneInputWithCountry, { type Props } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

/**
 * International Phone Number Input Component
 * 
 * Wrapper around react-phone-number-input with custom styling.
 * Features:
 * - Country code dropdown with flags
 * - Auto-formatting based on country
 * - Validation support
 * - Fully accessible
 * 
 * @example
 * ```tsx
 * <PhoneInput
 *   value={phone}
 *   onChange={setPhone}
 *   defaultCountry="VN"
 *   placeholder="Enter phone number"
 * />
 * ```
 */
export function PhoneInput(props: Props<any>) {
  return (
    <PhoneInputWithCountry
      {...props}
      international
      countryCallingCodeEditable={false}
      className="phone-input-wrapper"
      numberInputProps={{
        className: 'phone-number-input',
      }}
      countrySelectProps={{
        className: 'phone-country-select',
      }}
    />
  );
}
