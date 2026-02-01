
# Plan: Expand Cleaning Services with New Categories

## Overview
Add 13 new cleaning service categories from the uploaded data, with all pricing set R15 cheaper than the SweepSouth reference prices. This will transform the current 3-service cleaning wizard into a comprehensive service selection system.

## Services to Add

Based on the uploaded data, here are all the services with Pure360's competitive pricing (R15 cheaper):

| Service | Description | Pure360 Price |
|---------|-------------|---------------|
| Indoor Cleaning | 3.5-10 hours comprehensive home cleaning | Dynamic (current system) |
| Outdoor Services | Garden maintenance and dog walking | Quote-based |
| Office Cleaning | Half-day or full-day office cleaning | Quote-based |
| Moving Cleaning | Move-in/move-out deep cleaning | R235-R335 (was R250-R350) |
| Laundry & Ironing | Professional laundry services | Quote-based |
| Express Cleaning | 1-3 hour quick tasks | Dynamic (hourly) |
| Airbnb Cleaning | Short-term rental turnover | Current system |
| One-Time Cleaning | Single, flexible booking | R235-R335 (was R250-R350) |
| Deep Cleaning | Intensive specialized cleaning | Current system |
| Gardening Services | Landscaping and irrigation | Quote-based |
| Window Cleaning | Professional window cleaning | R45-R55/hr (was R60-R70) |
| Commercial Cleaning | Office and industrial spaces | R5.10/sqm (was R5.25) |
| Small Business Cleaning | Retail and small facility cleaning | Quote-based |

## Implementation Approach

### 1. Reorganize Services into Categories

**Instant Book Services** (with calculator):
- Indoor/Regular Cleaning
- Deep Cleaning  
- Airbnb Cleaning
- Express Cleaning (1-3 hours)
- Moving Cleaning
- One-Time Cleaning
- Window Cleaning

**Quote Request Services** (form submission):
- Office Cleaning
- Commercial Cleaning
- Small Business Cleaning
- Outdoor Services
- Gardening Services
- Laundry & Ironing

### 2. Update UI Flow

Create a new two-step service selection:
1. **Step 1**: Choose service category (grid of all 13 options)
2. **Step 2A**: For instant-book services, proceed to room/time selection
2. **Step 2B**: For quote services, show a quote request form

### 3. Update Pricing

Current pricing structure:
- Base: R300 for 3 hours
- Hourly: R80/hour

New pricing (R15 cheaper where applicable):
- Base: R285 for 3 hours
- Hourly: R65/hour
- Window Cleaning: R50/hour (R15 cheaper than R65)

---

## Technical Details

### Files to Modify

1. **`src/components/cleaning/CleaningWizard.tsx`**
   - Expand SERVICE_TYPES array from 3 to 13 services
   - Add category grouping (instant-book vs quote-request)
   - Update pricing constants (BASE_PRICE: 300 -> 285, HOURLY_RATE: 80 -> 65)
   - Add conditional flow for quote-based services
   - Add icons for each new service type

2. **`src/pages/Cleaning.tsx`**
   - Update page title to reflect broader service offering
   - May need responsive grid adjustments for 13 services

3. **`src/pages/Index.tsx`** & **`src/pages/ClientDashboard.tsx`**
   - Update service descriptions to reflect expanded offerings

4. **`supabase/functions/chat/index.ts`**
   - Update chatbot system prompt with new services and pricing

### Database Considerations
The existing `bookings` table already uses a flexible `service_type` string field, so no database migration is needed - it can store any of the new service type IDs.

### New Service Type IDs
```
indoor_cleaning, outdoor_services, office_cleaning, moving_cleaning,
laundry_ironing, express_cleaning, airbnb, one_time_cleaning,
deep_clean, gardening, window_cleaning, commercial_cleaning,
small_business_cleaning
```

### Quote-Based Service Flow
For services that require quotes, the wizard will:
1. Show service details and what's included
2. Display a simplified form (similar to existing Removals/Care quote forms)
3. Submit to existing `quote_requests` table with `service_type` set appropriately

---

## Summary

This expansion will:
- Grow from 3 to 13 cleaning service options
- Maintain competitive pricing (R15 cheaper across the board)
- Keep the user-friendly wizard interface
- Support both instant bookings and quote requests in one flow
- Require no database changes
