# Architecture Decision: Implementing Availability Calendar

## 1. Context

The user requested to implement the missing functionality for displaying the therapist's availability on their public profile page, as specified in `telas.md`.

- **File to Modify:** `src/pages/TherapistDetail.tsx`
- **Component to Use:** `src/components/therapist/AvailabilityCalendar.tsx`

## 2. Analysis

- The `TherapistDetail.tsx` page fetches all data for a specific therapist using the `useTherapistDetail` hook.
- The `AvailabilityCalendar.tsx` component is already created and expects an `availability` prop with the following structure:
  ```typescript
  interface AvailabilityData {
    [day: string]: string[]; // e.g., { Segunda: ["09:00", "10:00"], ... }
  }
  ```
- The current `TherapistDetail.tsx` page displays therapist information in a series of `Card` components. It does not use tabs as initially suggested in `telas.md`, so the new section will be added as a new `Card`.
- There is a "Ver Disponibilidade" button in the sidebar that will become redundant once the calendar is displayed directly on the page.

## 3. Design and Decision

1.  **Integration Strategy:** The `AvailabilityCalendar` component will be integrated directly into the main content area of the `TherapistDetail.tsx` page. This provides immediate visibility of the therapist's schedule, improving user experience.
2.  **Data Flow:** The `therapist` object, fetched by the `useTherapistDetail` hook, is assumed to contain an `availability` property that matches the `AvailabilityData` interface. This property will be passed directly to the `AvailabilityCalendar` component.
    ```tsx
    <AvailabilityCalendar availability={therapist.availability} />
    ```
3.  **UI Changes:**
    - A new `Card` titled "Disponibilidade" will be added to the main column (`md:col-span-2`).
    - The "Ver Disponibilidade" button inside the "Contato" card in the sidebar will be removed to avoid redundancy.
4.  **Documentation:** The `plan.md` and `telas.md` files will be updated to reflect the completion of this task.

## 4. Rationale

This approach is consistent with the existing architecture of the page (component-based cards), requires minimal changes, and directly addresses the user's request. It reuses the existing `AvailabilityCalendar` component and assumes a logical data structure from the backend, which is a standard practice in frontend development.
