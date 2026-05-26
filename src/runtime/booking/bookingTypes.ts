export type BookingHtmlViewModel = {
  token: string;
  title: string;
  brand: string;
  subtitle: string;
  successMessage: string;
  expiresAtFormatted: string;
  styles: string;
  script: string;
};

export type BookingScriptConfig = {
  token: string;
  successMessage: string;
};