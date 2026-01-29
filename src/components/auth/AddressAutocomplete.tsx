/// <reference types="@types/google.maps" />

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, AlertCircle } from "lucide-react";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, lat: number | null, lng: number | null) => void;
  error?: string;
  required?: boolean;
}

const AddressAutocomplete = ({ value, onChange, error, required }: AddressAutocompleteProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [isValidSelection, setIsValidSelection] = useState(!!value);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.formatted_address && place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setInputValue(place.formatted_address);
      setIsValidSelection(true);
      onChange(place.formatted_address, lat, lng);
    }
  }, [onChange]);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (typeof google !== "undefined" && google?.maps?.places) {
      setIsGoogleLoaded(true);
      return;
    }

    // Load Google Maps Script
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn("Google Maps API key not configured");
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => setIsGoogleLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isGoogleLoaded || !inputRef.current || autocompleteRef.current) return;

    if (typeof google === "undefined" || !google?.maps?.places) return;

    // Initialize autocomplete
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "za" }, // South Africa
    });

    autocompleteRef.current.addListener("place_changed", handlePlaceChanged);
  }, [isGoogleLoaded, handlePlaceChanged]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsValidSelection(false);
    // Clear lat/lng when user types manually
    onChange(e.target.value, null, null);
  };

  const showValidationError = inputValue && !isValidSelection;

  return (
    <div className="space-y-2">
      <Label htmlFor="address">
        Physical Address {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          id="address"
          type="text"
          placeholder="Start typing your address..."
          value={inputValue}
          onChange={handleInputChange}
          className={`pl-10 ${showValidationError || error ? "border-destructive" : ""}`}
          required={required}
        />
      </div>
      {showValidationError && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3" />
          Please select an address from the dropdown
        </p>
      )}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      {!isGoogleLoaded && (
        <p className="text-xs text-muted-foreground">
          Loading address autocomplete...
        </p>
      )}
    </div>
  );
};

export default AddressAutocomplete;
