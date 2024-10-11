interface BankAccount {
  account_name: string;
  account_number: string;
  bank_name: string;
  id: number;
}

interface IRemoteUser {
  bank_accounts: BankAccount[];
  birth_date: string;
  country: string;
  currency_code: string;
  currency_symbol: string;
  id: number;
  key: string;
  label: string;
  phone_code: string;
  ethnicity: string;
  gender: string;
  latitude: number;
  location: string;
  location_updated_at: string;
  longitude: number;
  primary_language: string;
  profile_photo_url: string | null;
  religion: string;
  spoken_languages: string[];
  wallet_balance: string;
}
