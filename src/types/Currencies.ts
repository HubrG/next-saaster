interface Currency {
  sigle: string;
  name: string;
}
export interface Currencies {
  [key: string]: Currency;
}
