/// <reference types="@types/google.maps" />

export interface SAAddressData {
  streetNumber: string;
  streetName: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  fullAddress: string;
  latitude: number | null;
  longitude: number | null;
}

export const mapGoogleAddressToSA = (place: google.maps.places.PlaceResult): SAAddressData => {
  const components = place.address_components || [];

  const getComponent = (types: string[]) =>
    components.find(c => types.some(t => c.types.includes(t)))?.long_name || "";

  return {
    streetNumber: getComponent(["street_number"]),
    streetName: getComponent(["route"]),
    suburb: getComponent(["sublocality_level_1", "sublocality", "neighborhood"]),
    city: getComponent(["locality"]),
    province: getComponent(["administrative_area_level_1"]),
    postalCode: getComponent(["postal_code"]),
    fullAddress: place.formatted_address || "",
    latitude: place.geometry?.location?.lat() ?? null,
    longitude: place.geometry?.location?.lng() ?? null,
  };
};
