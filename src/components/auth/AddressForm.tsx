/// <reference types="@types/google.maps" />

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Search, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

const AddressForm = ({ initialData, onChange, required = false }: AddressFormProps) => {
  const [coordinates, setCoordinates] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: initialData?.latitude || null,
    longitude: initialData?.longitude || null,
  });

  const [searchValue, setSearchValue] = useState("");
  const [isManual, setIsManual] = useState(!!initialData?.streetAddress);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const form = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      unit: initialData?.unitNumber || "",
      complex: initialData?.complexName || "",
      street: initialData?.streetAddress || "",
      suburb: initialData?.suburb || "",
      city: initialData?.city || "",
      province: (initialData?.province as AddressValues["province"]) || "Gauteng",
      postalCode: initialData?.postalCode || "",
    },
    mode: "onChange",
  });

  const formValues = form.watch();
  const isValid = form.formState.isValid;

  // Build full address string
  const buildFullAddress = useCallback(() => {
    const parts = [
      formValues.unit && `Unit ${formValues.unit}`,
      formValues.complex,
      formValues.street,
      formValues.suburb,
      formValues.city,
      formValues.province,
      formValues.postalCode,
    ].filter(Boolean);
    return parts.join(", ");
  }, [formValues]);

  // Notify parent of changes
  useEffect(() => {
    const data: AddressData = {
      unitNumber: formValues.unit,
      complexName: formValues.complex || "",
      streetAddress: formValues.street,
      suburb: formValues.suburb,
      city: formValues.city,
      province: formValues.province,
      postalCode: formValues.postalCode,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      fullAddress: buildFullAddress(),
    };
    
    const valid = required ? isValid : true;
    onChange(data, valid);
  }, [formValues, coordinates, buildFullAddress, isValid, required, onChange]);

  // Handle place selection
  const onAddressSelect = useCallback((place: google.maps.places.PlaceResult) => {
    if (!place?.address_components || !place.geometry?.location) return;

    const mapped = mapGoogleAddressToSA(place);

    form.setValue("street", `${mapped.streetNumber} ${mapped.streetName}`.trim(), { shouldValidate: true });
    form.setValue("suburb", mapped.suburb || mapped.city, { shouldValidate: true });
    form.setValue("city", mapped.city, { shouldValidate: true });
    
    // Only set province if it's a valid SA province
    const matchedProvince = SA_PROVINCES.find(
      (p) => p.toLowerCase() === mapped.province.toLowerCase()
    );
    if (matchedProvince) {
      form.setValue("province", matchedProvince, { shouldValidate: true });
    }
    
    form.setValue("postalCode", mapped.postalCode, { shouldValidate: true });

    setCoordinates({
      latitude: mapped.latitude,
      longitude: mapped.longitude,
    });

    setSearchValue(mapped.fullAddress);
    setIsManual(true);

    // Focus unit field
    setTimeout(() => form.setFocus("unit"), 100);
  }, [form]);

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

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (place) onAddressSelect(place);
    });
  }, [isGoogleLoaded, onAddressSelect]);

  return (
    <Form {...form}>
      <div className="space-y-4">
        {/* Search Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="address-search" className="text-sm font-medium flex items-center gap-2">
              <Search className="h-4 w-4" />
              Where should we come?
              {required && <span className="text-destructive">*</span>}
            </label>
            <button
              type="button"
              onClick={() => setIsManual(!isManual)}
              className="text-xs text-primary underline hover:text-primary/80"
            >
              {isManual ? "Hide details" : "Can't find it? Enter manually"}
            </button>
          </div>

          <div className="relative">
            <input
              ref={inputRef}
              id="address-search"
              type="text"
              placeholder="Start typing your address..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit / Flat No. *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 12A (use '1' for houses)"
                          className="border-primary/50 focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="complex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complex Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sandton Heights" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Street */}
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Number & Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 123 Main Road" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Suburb */}
              <FormField
                control={form.control}
                name="suburb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suburb *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sandton" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City & Postal Code */}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Johannesburg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code *</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="numeric"
                          maxLength={4}
                          placeholder="e.g., 2196"
                          {...field}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/\D/g, "").slice(0, 4);
                            field.onChange(cleaned);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Province */}
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border z-50">
                        {SA_PROVINCES.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </Form>
  );
};

export default AddressForm;
