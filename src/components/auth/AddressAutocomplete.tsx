/// <reference types="@types/google.maps" />

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, lat: number | null, lng: number | null) => void;
  error?: string;
  required?: boolean;
}

// Validate manual address entry
const validateManualAddress = (address: string): { isValid: boolean; error: string | null } => {
  const trimmed = address.trim();
  
  // Minimum length check
  if (trimmed.length < 10) {
    return { isValid: false, error: "Address is too short. Please enter a complete address." };
  }
  
  // Maximum length check
  if (trimmed.length > 300) {
    return { isValid: false, error: "Address is too long. Please shorten it." };
  }
  
  // Must contain at least one number (street number)
  if (!/\d/.test(trimmed)) {
    return { isValid: false, error: "Please include a street number in your address." };
  }
  
  // Must contain at least one letter
  if (!/[a-zA-Z]/.test(trimmed)) {
    return { isValid: false, error: "Please include a street name in your address." };
  }
  
  // Should have at least 2 words (street number + name)
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 2) {
    return { isValid: false, error: "Please enter a more complete address (e.g., 123 Main Street, City)." };
  }
  
  // Check for potentially harmful characters (basic sanitization)
  if (/[<>{}[\]\\]/.test(trimmed)) {
    return { isValid: false, error: "Address contains invalid characters." };
  }
  
  return { isValid: true, error: null };
};

const AddressAutocomplete = ({ value, onChange, error, required }: AddressAutocompleteProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [isValidSelection, setIsValidSelection] = useState(!!value);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualValidationError, setManualValidationError] = useState<string | null>(null);
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

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => setIsGoogleLoaded(true));
      return;
    }

    // Fetch API key from edge function
    const loadGoogleMaps = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-maps-api-key");
        
        if (error || !data?.apiKey) {
          setLoadError("Address autocomplete unavailable");
          console.error("Failed to load Google Maps API key:", error || "No API key returned");
          return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setIsGoogleLoaded(true);
        script.onerror = () => setLoadError("Failed to load Google Maps");
        document.head.appendChild(script);
      } catch (err) {
        setLoadError("Address autocomplete unavailable");
        console.error("Error fetching Maps API key:", err);
      }
    };

    loadGoogleMaps();
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
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (isManualMode) {
      // In manual mode, validate the address
      const validation = validateManualAddress(newValue);
      setManualValidationError(validation.error);
      setIsValidSelection(validation.isValid);
      
      if (validation.isValid) {
        onChange(newValue, null, null);
      } else {
        // Still update the value but mark as invalid
        onChange(newValue, null, null);
      }
    } else {
      setIsValidSelection(false);
      setManualValidationError(null);
      // Clear lat/lng when user types manually
      onChange(newValue, null, null);
    }
  };

  const enableManualMode = () => {
    setIsManualMode(true);
    if (inputValue.trim()) {
      const validation = validateManualAddress(inputValue);
      setManualValidationError(validation.error);
      setIsValidSelection(validation.isValid);
      onChange(inputValue, null, null);
    }
  };

  const showValidationError = !isManualMode && inputValue && !isValidSelection;
  const showManualValidationError = isManualMode && manualValidationError && inputValue;
  const showManualSuccess = isManualMode && isValidSelection && inputValue && !manualValidationError;

  return (
    <div className="space-y-2">
      <Label htmlFor="address">
        Physical Address {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Search address"
        >
          <Search className="h-4 w-4" />
        </button>
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
        <div className="space-y-1">
          <p className="flex items-center gap-1 text-xs text-destructive">
            <AlertCircle className="h-3 w-3" />
            Please select an address from the dropdown
          </p>
          <button
            type="button"
            onClick={enableManualMode}
            className="text-xs text-primary hover:underline"
          >
            Or enter address manually
          </button>
        </div>
      )}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      {loadError && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {loadError}
          </p>
          {!isManualMode && (
            <button
              type="button"
              onClick={enableManualMode}
              className="text-xs text-primary hover:underline"
            >
              Enter address manually instead
            </button>
          )}
        </div>
      )}
      {!isGoogleLoaded && !loadError && (
        <p className="text-xs text-muted-foreground">
          Loading address autocomplete...
        </p>
      )}
      {showManualValidationError && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3" />
          {manualValidationError}
        </p>
      )}
      {showManualSuccess && (
        <p className="flex items-center gap-1 text-xs text-primary">
          <CheckCircle2 className="h-3 w-3" />
          Address format looks good (coordinates unavailable in manual mode)
        </p>
      )}
      {isManualMode && !inputValue && (
        <p className="text-xs text-muted-foreground">
          Enter your full address including street number, street name, and city
        </p>
      )}
    </div>
  );
};

export default AddressAutocomplete;
