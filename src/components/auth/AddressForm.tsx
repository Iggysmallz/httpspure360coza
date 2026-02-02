/// <reference types="@types/google.maps" />

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { mapGoogleAddressToSA } from "@/utils/addressMapper";
import { addressSchema, SA_PROVINCES, type AddressValues } from "@/utils/addressSchema";

export interface AddressData {
  unitNumber: string;
  complexName: string;
  streetAddress: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  fullAddress: string;
}

interface AddressFormProps {
  initialData?: Partial<AddressData>;
  onChange: (data: AddressData, isValid: boolean) => void;
  required?: boolean;
}

const parseExistingAddress = (address: string): Partial<AddressData> => {
  const parts = address.split(",").map((p) => p.trim());

  if (parts.length >= 4) {
    return {
      streetAddress: parts[0] || "",
      suburb: parts[1] || "",
      city: parts[2] || "",
      province: parts[3] || "",
      postalCode: parts[4] || "",
    };
  }

  return { streetAddress: address };
};

const AddressForm = ({ initialData, onChange, required = false }: AddressFormProps) => {
  const parsedInitial = initialData?.fullAddress
    ? parseExistingAddress(initialData.fullAddress)
    : {};

  const [address, setAddress] = useState({
    unit: initialData?.unitNumber || "",
    complex: initialData?.complexName || "",
    street: initialData?.streetAddress || parsedInitial.streetAddress || "",
    suburb: initialData?.suburb || parsedInitial.suburb || "",
    city: initialData?.city || parsedInitial.city || "",
    province: initialData?.province || parsedInitial.province || "",
    postalCode: initialData?.postalCode || parsedInitial.postalCode || "",
  });

  const [coordinates, setCoordinates] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: initialData?.latitude || null,
    longitude: initialData?.longitude || null,
  });

  const [searchValue, setSearchValue] = useState("");
  const [isManual, setIsManual] = useState(
    !!(initialData?.streetAddress || parsedInitial.streetAddress)
  );
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const unitInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Build full address string
  const buildFullAddress = useCallback(() => {
    const parts = [
      address.unit && `Unit ${address.unit}`,
      address.complex,
      address.street,
      address.suburb,
      address.city,
      address.province,
      address.postalCode,
    ].filter(Boolean);
    return parts.join(", ");
  }, [address]);

  // Validate form using Zod schema
  const validateForm = useCallback(() => {
    if (!required) return true;
    const result = addressSchema.safeParse(address);
    return result.success;
  }, [required, address]);

  // Get validation errors for display
  const getFieldError = useCallback((field: keyof AddressValues): string | undefined => {
    const result = addressSchema.safeParse(address);
    if (result.success) return undefined;
    const fieldError = result.error.errors.find((e) => e.path[0] === field);
    return fieldError?.message;
  }, [address]);

  // Notify parent of changes
  useEffect(() => {
    const data: AddressData = {
      unitNumber: address.unit,
      complexName: address.complex,
      streetAddress: address.street,
      suburb: address.suburb,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      fullAddress: buildFullAddress(),
    };
    onChange(data, validateForm());
  }, [address, coordinates, buildFullAddress, validateForm, onChange]);

  // Handle place selection
  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.address_components || !place.geometry?.location) return;

    const mapped = mapGoogleAddressToSA(place);

    setAddress((prev) => ({
      ...prev,
      street: `${mapped.streetNumber} ${mapped.streetName}`.trim(),
      suburb: mapped.suburb || mapped.city,
      city: mapped.city,
      province: mapped.province,
      postalCode: mapped.postalCode,
    }));

    setCoordinates({
      latitude: mapped.latitude,
      longitude: mapped.longitude,
    });

    setSearchValue(mapped.fullAddress);
    setIsManual(true);

    // Focus unit field for quick entry
    setTimeout(() => unitInputRef.current?.focus(), 100);
  }, []);

  // Load Google Maps
  useEffect(() => {
    if (typeof google !== "undefined" && google?.maps?.places) {
      setIsGoogleLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => setIsGoogleLoaded(true));
      return;
    }

    const loadGoogleMaps = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          setIsManual(true);
          return;
        }

        const { data, error } = await supabase.functions.invoke("get-maps-api-key");

        if (error || !data?.apiKey) {
          setLoadError("Address search unavailable");
          setIsManual(true);
          return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setIsGoogleLoaded(true);
        script.onerror = () => {
          setLoadError("Failed to load address search");
          setIsManual(true);
        };
        document.head.appendChild(script);
      } catch {
        setLoadError("Address search unavailable");
        setIsManual(true);
      }
    };

    loadGoogleMaps();
  }, []);

  // Initialize autocomplete
  useEffect(() => {
    if (!isGoogleLoaded || !inputRef.current || autocompleteRef.current) return;
    if (typeof google === "undefined" || !google?.maps?.places) return;

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "za" },
    });

    autocompleteRef.current.addListener("place_changed", handlePlaceChanged);
  }, [isGoogleLoaded, handlePlaceChanged]);

  const handlePostalCodeChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    setAddress((prev) => ({ ...prev, postalCode: cleaned }));
  };

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="address-search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Where should we come?
            {required && <span className="text-destructive">*</span>}
          </Label>
          <button
            type="button"
            onClick={() => setIsManual(!isManual)}
            className="text-xs text-primary underline hover:text-primary/80"
          >
            {isManual ? "Hide details" : "Can't find it? Enter manually"}
          </button>
        </div>

        <div className="relative">
          <Input
            ref={inputRef}
            id="address-search"
            type="text"
            placeholder="Start typing your address..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pr-10"
          />
          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        {!isGoogleLoaded && !loadError && (
          <p className="text-xs text-muted-foreground">Loading address search...</p>
        )}

        {loadError && <p className="text-xs text-muted-foreground">{loadError}</p>}
      </div>

      {/* Detailed Fields */}
      {isManual && (
        <Card className="border-border">
          <CardContent className="pt-4 space-y-4">
            {/* Unit & Complex */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="unit">Unit / Flat No.</Label>
                <Input
                  ref={unitInputRef}
                  id="unit"
                  placeholder="e.g., 12A"
                  value={address.unit}
                  onChange={(e) => setAddress({ ...address, unit: e.target.value })}
                  className="border-primary/50 focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complex">Complex Name (Optional)</Label>
                <Input
                  id="complex"
                  placeholder="e.g., Sandton Heights"
                  value={address.complex}
                  onChange={(e) => setAddress({ ...address, complex: e.target.value })}
                />
              </div>
            </div>

            {/* Street */}
            <div className="space-y-2">
              <Label htmlFor="street">
                Street Number & Name {required && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="street"
                placeholder="e.g., 123 Main Road"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                required={required}
              />
            </div>

            {/* Suburb */}
            <div className="space-y-2">
              <Label htmlFor="suburb">
                Suburb {required && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="suburb"
                placeholder="e.g., Sandton"
                value={address.suburb}
                onChange={(e) => setAddress({ ...address, suburb: e.target.value })}
                required={required}
              />
            </div>

            {/* City & Postal Code */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">
                  City {required && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="city"
                  placeholder="e.g., Johannesburg"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required={required}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">
                  Postal Code {required && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="postalCode"
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                  placeholder="e.g., 2196"
                  value={address.postalCode}
                  onChange={(e) => handlePostalCodeChange(e.target.value)}
                  required={required}
                  className={cn(
                    address.postalCode &&
                      address.postalCode.length !== 4 &&
                      "border-destructive"
                  )}
                />
                {address.postalCode && address.postalCode.length !== 4 && (
                  <p className="text-xs text-destructive">Postal code must be 4 digits</p>
                )}
              </div>
            </div>

            {/* Province */}
            <div className="space-y-2">
              <Label htmlFor="province">
                Province {required && <span className="text-destructive">*</span>}
              </Label>
              <Select
                value={address.province}
                onValueChange={(v) => setAddress({ ...address, province: v })}
              >
                <SelectTrigger id="province" className="bg-background">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  {SA_PROVINCES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddressForm;
