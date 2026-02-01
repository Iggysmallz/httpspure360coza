/// <reference types="@types/google.maps" />

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Building2, Home, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

// South African provinces
const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
] as const;

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
  // Try to parse an existing address string into components
  // This is a best-effort parse for addresses like "123 Main Street, Suburb, City, Province, 1234"
  const parts = address.split(",").map(p => p.trim());
  
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
  // Parse initial address if it's a string
  const parsedInitial = initialData?.fullAddress 
    ? parseExistingAddress(initialData.fullAddress) 
    : {};
  
  const [unitNumber, setUnitNumber] = useState(initialData?.unitNumber || "");
  const [complexName, setComplexName] = useState(initialData?.complexName || "");
  const [streetAddress, setStreetAddress] = useState(initialData?.streetAddress || parsedInitial.streetAddress || "");
  const [suburb, setSuburb] = useState(initialData?.suburb || parsedInitial.suburb || "");
  const [city, setCity] = useState(initialData?.city || parsedInitial.city || "");
  const [province, setProvince] = useState(initialData?.province || parsedInitial.province || "");
  const [postalCode, setPostalCode] = useState(initialData?.postalCode || parsedInitial.postalCode || "");
  const [latitude, setLatitude] = useState<number | null>(initialData?.latitude || null);
  const [longitude, setLongitude] = useState<number | null>(initialData?.longitude || null);

  const [searchValue, setSearchValue] = useState("");
  const [isManualMode, setIsManualMode] = useState(false);
  const [hasSelectedAddress, setHasSelectedAddress] = useState(
    !!(initialData?.streetAddress || parsedInitial.streetAddress)
  );
  const [showDetails, setShowDetails] = useState(hasSelectedAddress);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const unitInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Build full address string
  const buildFullAddress = useCallback(() => {
    const parts = [
      unitNumber && `Unit ${unitNumber}`,
      complexName,
      streetAddress,
      suburb,
      city,
      province,
      postalCode,
    ].filter(Boolean);
    return parts.join(", ");
  }, [unitNumber, complexName, streetAddress, suburb, city, province, postalCode]);

  // Validate form
  const validateForm = useCallback(() => {
    if (!required) return true;
    
    const hasStreet = streetAddress.trim().length > 0;
    const hasSuburb = suburb.trim().length > 0;
    const hasCity = city.trim().length > 0;
    const hasProvince = province.trim().length > 0;
    const validPostal = /^\d{4}$/.test(postalCode);
    
    return hasStreet && hasSuburb && hasCity && hasProvince && validPostal;
  }, [required, streetAddress, suburb, city, province, postalCode]);

  // Notify parent of changes
  useEffect(() => {
    const data: AddressData = {
      unitNumber,
      complexName,
      streetAddress,
      suburb,
      city,
      province,
      postalCode,
      latitude,
      longitude,
      fullAddress: buildFullAddress(),
    };
    onChange(data, validateForm());
  }, [unitNumber, complexName, streetAddress, suburb, city, province, postalCode, latitude, longitude, buildFullAddress, validateForm, onChange]);

  // Handle place selection from Google
  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.address_components || !place.geometry?.location) return;

    // Extract address components
    let streetNumber = "";
    let route = "";
    let sublocality = "";
    let locality = "";
    let adminArea1 = "";
    let postalCodeValue = "";

    for (const component of place.address_components) {
      const types = component.types;
      if (types.includes("street_number")) {
        streetNumber = component.long_name;
      } else if (types.includes("route")) {
        route = component.long_name;
      } else if (types.includes("sublocality") || types.includes("sublocality_level_1")) {
        sublocality = component.long_name;
      } else if (types.includes("locality")) {
        locality = component.long_name;
      } else if (types.includes("administrative_area_level_1")) {
        adminArea1 = component.long_name;
      } else if (types.includes("postal_code")) {
        postalCodeValue = component.long_name;
      }
    }

    // Update state
    setStreetAddress(`${streetNumber} ${route}`.trim());
    setSuburb(sublocality || locality);
    setCity(locality);
    setProvince(adminArea1);
    setPostalCode(postalCodeValue);
    setLatitude(place.geometry.location.lat());
    setLongitude(place.geometry.location.lng());
    setHasSelectedAddress(true);
    setShowDetails(true);
    setSearchValue(place.formatted_address || "");

    // Focus unit number field for quick entry
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
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsManualMode(true);
          setShowDetails(true);
          return;
        }

        const { data, error } = await supabase.functions.invoke("get-maps-api-key");
        
        if (error || !data?.apiKey) {
          setLoadError("Address search unavailable");
          setIsManualMode(true);
          setShowDetails(true);
          return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setIsGoogleLoaded(true);
        script.onerror = () => {
          setLoadError("Failed to load address search");
          setIsManualMode(true);
          setShowDetails(true);
        };
        document.head.appendChild(script);
      } catch (err) {
        setLoadError("Address search unavailable");
        setIsManualMode(true);
        setShowDetails(true);
      }
    };

    loadGoogleMaps();
  }, []);

  // Initialize autocomplete
  useEffect(() => {
    if (!isGoogleLoaded || !searchInputRef.current || autocompleteRef.current || isManualMode) return;
    if (typeof google === "undefined" || !google?.maps?.places) return;

    autocompleteRef.current = new google.maps.places.Autocomplete(searchInputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "za" },
    });

    autocompleteRef.current.addListener("place_changed", handlePlaceChanged);
  }, [isGoogleLoaded, isManualMode, handlePlaceChanged]);

  const handleManualToggle = () => {
    setIsManualMode(true);
    setShowDetails(true);
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPostalCode(value);
  };

  return (
    <div className="space-y-4">
      {/* Google Search Bar - Only show if not in manual mode */}
      {!isManualMode && (
        <div className="space-y-2">
          <Label htmlFor="address-search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Address
            {required && <span className="text-destructive">*</span>}
          </Label>
          <div className="relative">
            <Input
              ref={searchInputRef}
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
          
          {loadError && (
            <p className="text-xs text-muted-foreground">{loadError}</p>
          )}
          
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={handleManualToggle}
            className="h-auto p-0 text-xs"
          >
            Can't find it? Enter manually
          </Button>
        </div>
      )}

      {/* Unit & Complex Fields - Show after selection or in manual mode */}
      {(hasSelectedAddress || isManualMode) && (
        <div className="rounded-lg border bg-card p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Building2 className="h-4 w-4" />
            Unit Details (Important for complexes/estates)
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="unit-number" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                Unit / Flat Number
              </Label>
              <Input
                ref={unitInputRef}
                id="unit-number"
                type="text"
                placeholder="e.g., 12A, Unit 5"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="complex-name">Complex / Building Name</Label>
              <Input
                id="complex-name"
                type="text"
                placeholder="e.g., Sandton Heights"
                value={complexName}
                onChange={(e) => setComplexName(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Expandable Address Details */}
      {showDetails && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
          >
            <MapPin className="h-4 w-4" />
            Address Details
            {showDetails ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
          </button>

          <div className="rounded-lg border bg-card p-4 space-y-4">
            {/* Street Address */}
            <div className="space-y-2">
              <Label htmlFor="street-address">
                Street Number & Name {required && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="street-address"
                type="text"
                placeholder="e.g., 123 Main Road"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
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
                type="text"
                placeholder="e.g., Sandton"
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                required={required}
              />
              <p className="text-xs text-muted-foreground">
                Important for zone-based pricing
              </p>
            </div>

            {/* City & Province */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">
                  City {required && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="e.g., Johannesburg"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required={required}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="province">
                  Province {required && <span className="text-destructive">*</span>}
                </Label>
                <Select value={province} onValueChange={setProvince}>
                  <SelectTrigger id="province">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {SA_PROVINCES.map((prov) => (
                      <SelectItem key={prov} value={prov}>
                        {prov}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Postal Code */}
            <div className="sm:w-1/2">
              <div className="space-y-2">
                <Label htmlFor="postal-code">
                  Postal Code {required && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="postal-code"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                  placeholder="e.g., 2196"
                  value={postalCode}
                  onChange={handlePostalCodeChange}
                  required={required}
                  className={cn(
                    postalCode && postalCode.length !== 4 && "border-destructive"
                  )}
                />
                {postalCode && postalCode.length !== 4 && (
                  <p className="text-xs text-destructive">
                    Postal code must be 4 digits
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual mode indicator */}
      {isManualMode && (
        <p className="text-xs text-muted-foreground">
          Enter your full address manually below
        </p>
      )}
    </div>
  );
};

export default AddressForm;
