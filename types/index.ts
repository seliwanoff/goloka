interface BankAccount {
  id: number;
  bank_code: number;
  bank_name: string;
  account_name: string;
  account_number: string;
}

interface Country {
  "currency-code": string;
  "currency-symbol": string;
  id: number;
  key: string;
  label: string;
  "phone-code": string;
}
export interface IRemoteUser {
  data: {
    bank_accounts: BankAccount[];
    birth_date: string;
    country: Country;
    ethnicity: string;
    gender: "male" | "female";
    id: number;
    latitude: number;
    longitude: number;
    location: string;
    location_updated_at: string;
    primary_language: string;
    profile_photo_url: string | null;
    religion: string;
    spoken_languages: string[];
    wallet_balance: string;
  };
  [x: string]: string | any;
}
