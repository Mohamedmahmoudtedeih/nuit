export interface CountryCode {
  code: string;
  dialCode: string;
  name: string;
  flag: string; // Emoji flag
}

export const countryCodes: CountryCode[] = [
  { code: 'MR', dialCode: '+222', name: 'Mauritanie', flag: '🇲🇷' },
  { code: 'FR', dialCode: '+33', name: 'France', flag: '🇫🇷' },
  { code: 'US', dialCode: '+1', name: 'États-Unis', flag: '🇺🇸' },
  { code: 'GB', dialCode: '+44', name: 'Royaume-Uni', flag: '🇬🇧' },
  { code: 'DE', dialCode: '+49', name: 'Allemagne', flag: '🇩🇪' },
  { code: 'IT', dialCode: '+39', name: 'Italie', flag: '🇮🇹' },
  { code: 'ES', dialCode: '+34', name: 'Espagne', flag: '🇪🇸' },
  { code: 'AE', dialCode: '+971', name: 'Émirats arabes unis', flag: '🇦🇪' },
  { code: 'SA', dialCode: '+966', name: 'Arabie saoudite', flag: '🇸🇦' },
  { code: 'EG', dialCode: '+20', name: 'Égypte', flag: '🇪🇬' },
  { code: 'MA', dialCode: '+212', name: 'Maroc', flag: '🇲🇦' },
  { code: 'DZ', dialCode: '+213', name: 'Algérie', flag: '🇩🇿' },
  { code: 'TN', dialCode: '+216', name: 'Tunisie', flag: '🇹🇳' },
  { code: 'SN', dialCode: '+221', name: 'Sénégal', flag: '🇸🇳' },
  { code: 'ML', dialCode: '+223', name: 'Mali', flag: '🇲🇱' },
  { code: 'CI', dialCode: '+225', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: 'CM', dialCode: '+237', name: 'Cameroun', flag: '🇨🇲' },
  { code: 'CD', dialCode: '+243', name: 'RD Congo', flag: '🇨🇩' },
  { code: 'KE', dialCode: '+254', name: 'Kenya', flag: '🇰🇪' },
  { code: 'NG', dialCode: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'ZA', dialCode: '+27', name: 'Afrique du Sud', flag: '🇿🇦' },
  { code: 'IN', dialCode: '+91', name: 'Inde', flag: '🇮🇳' },
  { code: 'CN', dialCode: '+86', name: 'Chine', flag: '🇨🇳' },
  { code: 'JP', dialCode: '+81', name: 'Japon', flag: '🇯🇵' },
  { code: 'KR', dialCode: '+82', name: 'Corée du Sud', flag: '🇰🇷' },
  { code: 'AU', dialCode: '+61', name: 'Australie', flag: '🇦🇺' },
  { code: 'CA', dialCode: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: 'BR', dialCode: '+55', name: 'Brésil', flag: '🇧🇷' },
  { code: 'MX', dialCode: '+52', name: 'Mexique', flag: '🇲🇽' },
  { code: 'AR', dialCode: '+54', name: 'Argentine', flag: '🇦🇷' },
  { code: 'TR', dialCode: '+90', name: 'Turquie', flag: '🇹🇷' },
  { code: 'RU', dialCode: '+7', name: 'Russie', flag: '🇷🇺' },
];

export const defaultCountryCode: CountryCode = countryCodes[0]; // Mauritania

