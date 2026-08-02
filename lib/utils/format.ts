export const formatPhoneNumber = (value: string): string => {
  if (!value) return "";
  const raw = value.replace(/[^0-9]/g, "");

  if (raw.length <= 3) {
    return raw;
  }
  if (raw.length <= 7) {
    return `${raw.slice(0, 3)}-${raw.slice(3)}`;
  }
  if (raw.length <= 11) {
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  }
  return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
};

export const formatZipcode = (value: string): string => {
  if (!value) return "";
  return value.replace(/[^0-9]/g, "").slice(0, 5);
};

export const formatPrice = (price: number): string => {
  if (typeof price !== "number" || isNaN(price)) return "0원";
  return `${price.toLocaleString()}원`;
};
