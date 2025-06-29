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

---

# Architecture Decision: Implementing Scheduling Page

## 1. Context

Following the checklist in `telas.md`, the next feature to be implemented is the **Scheduling Page** (`Tela de Agendamento`). This page allows a client to select a date and time for a session with a therapist after viewing their profile.

- **Checklist Item:** `[ ] Tela de Agendamento`
- **Entry Point:** From the therapist's public profile (`/therapist/:id`), a button will link to the scheduling page (`/agendar/:terapeutaId`).

## 2. Analysis

- The project follows a component-based architecture using React and TypeScript (`.tsx`).
- A clear separation exists between `pages` (top-level route components) and `components` (reusable UI elements).
- The scheduling process requires fetching the therapist's availability, managing the user's selection (date and time), and displaying a confirmation summary.

## 3. Design and Decision: Composite Components Pattern

To ensure scalability, reusability, and separation of concerns, a **Composite Components** pattern will be adopted. The feature will be broken down into a main page orchestrator and several specialized, reusable components.

1.  **Page Orchestrator (`pages/SchedulingPage/index.tsx`):**
    -   This will be the main component for the `/agendar/:terapeutaId` route.
    -   It will be responsible for fetching the therapist's availability data based on the `terapeutaId` from the URL.
    -   It will manage the state of the scheduling process, including the selected date and time.
    -   It will orchestrate the interaction between the child components.

2.  **Calendar Component (`components/scheduling/CalendarView.tsx`):**
    -   A reusable component to display a monthly calendar.
    -   It will receive the therapist's available days as a prop.
    -   It will highlight available days and disable unavailable ones.
    -   It will emit an `onDateSelect` event to the parent (`SchedulingPage`) when a user selects a date.

3.  **Time Slots Component (`components/scheduling/TimeSlots.tsx`):**
    -   A reusable component to display a list of available time slots for a given day.
    -   It will receive the list of available times as a prop.
    -   It will emit an `onTimeSelect` event to the parent (`SchedulingPage`) when a user selects a time.

4.  **Confirmation Modal (`components/scheduling/ConfirmationModal.tsx`):**
    -   A modal dialog that appears after a time is selected.
    -   It will receive the selected details (therapist info, date, time, price) as props.
    -   It will display a summary of the appointment and a "Confirm & Pay" button, which will later redirect to the payment flow.

## 4. Rationale

This approach aligns with the existing project structure and modern React development practices.
- **Separation of Concerns:** Each component has a single, well-defined responsibility.
- **Reusability:** Components like `CalendarView` and `TimeSlots` can be potentially reused elsewhere.
- **Testability:** Each component can be tested in isolation, simplifying unit and integration testing.
- **Maintainability:** The clear structure makes the code easier to understand, debug, and extend in the future.

---

# Architecture Decision: Implementing Payment Flow

## 1. Context

Following the completion of the scheduling feature, the next step in the `telas.md` checklist is to implement the **Payment Flow**. This is a critical part of the application, allowing clients to pay for their scheduled sessions.

- **Checklist Items:** `[ ] Tela de Seleção de Método de Pagamento`, `[ ] Tela de Checkout (Cartão)`
- **Entry Point:** After confirming an appointment in the `ConfirmationModal` on the `SchedulingPage`.

## 2. Analysis & Security Considerations

- Implementing a payment flow requires the highest level of security, particularly concerning credit card data (PCI DSS Compliance).
- The project **must not** handle or store raw credit card information on its own servers or frontend code.
- The `package.json` file shows that no payment gateway library (e.g., Stripe, Pagar.me) is currently installed. This is a necessary new dependency.

## 3. Design and Decision: Stripe Integration

To ensure security and a robust implementation, the following design has been chosen:

1.  **Payment Gateway: Stripe**
    -   **Decision:** We will integrate **Stripe** as the payment gateway.
    -   **Rationale:** Stripe is an industry leader known for its security, excellent documentation, and developer-friendly tools. Its `react-stripe-js` library with Stripe Elements allows for the creation of secure, PCI-compliant payment forms where sensitive data is sent directly to Stripe, bypassing our application's backend.
    -   **Action:** This will require installing the `@stripe/react-stripe-js` and `@stripe/stripe-js` packages.

2.  **Component and Page Structure:**
    -   **`pages/PaymentMethodPage/index.tsx`**: A page for users to select their preferred payment method (Credit Card, PIX, etc.). It will use `RadioGroup` from `shadcn/ui` for the selection.
    -   **`pages/CreditCardCheckoutPage/index.tsx`**: A page dedicated to the credit card payment form. This page will host the Stripe Elements provider and the checkout form.
    -   **`components/payment/CheckoutForm.tsx`**: A dedicated component that encapsulates the Stripe payment form logic, including input fields and the payment submission button.

3.  **Data Flow:**
    -   Appointment details (price, therapist, etc.) will be passed from the `SchedulingPage` to the payment flow using the `state` property of `react-router-dom`'s `navigate` function. This is a secure way to pass transient data between routes without exposing it in the URL.

## 4. Rationale

This approach prioritizes security by leveraging a trusted third-party provider (Stripe) and its secure Elements. It aligns with the existing component-based architecture of the project and uses established libraries (`react-hook-form`, `zod`) for form handling, ensuring a consistent and maintainable implementation.

---

# Architecture Decision: Implementing Communication Features

## 1. Context

The next major features in the `telas.md` checklist are the **Communication Screens**, which include a real-time Chat and a Video Call function. These features are essential for connecting clients and therapists directly through the platform.

## 2. Analysis & Technical Challenges

- **Real-Time Chat:** Requires a persistent, low-latency connection to a server to push and receive messages instantly. Building a custom WebSocket server is an option, but it adds significant maintenance overhead.
- **Video Call:** This is the most complex feature. WebRTC, the underlying technology, requires a signaling server to orchestrate connections, and STUN/TURN servers to traverse network firewalls (NAT). Building, securing, and scaling this infrastructure from scratch is a highly specialized and resource-intensive task.

## 3. Design and Decision: Leveraging Managed Services

To mitigate complexity and ensure a secure, scalable, and production-ready implementation, we will use industry-leading Backend-as-a-Service (BaaS) providers.

1.  **Chat Feature: Google Firebase (Cloud Firestore)**
    -   **Decision:** We will use **Cloud Firestore** for the real-time chat backend.
    -   **Rationale:** Firebase provides a powerful real-time database with a simple and effective client-side SDK. It handles authentication, security rules, and data synchronization automatically, allowing us to build the chat UI without managing a complex backend infrastructure. It is highly scalable and cost-effective.
    -   **Action:** This will require installing the `firebase` package and configuring a new Firebase project.

2.  **Video Call Feature: Twilio Programmable Video**
    -   **Decision:** We will use the **Twilio Programmable Video** API.
    -   **Rationale:** Twilio is the industry standard for communication APIs. Their Video SDK handles all the complexities of WebRTC, including signaling, media servers, and cross-browser compatibility. This allows us to deliver a high-quality, reliable video experience without building the underlying infrastructure.
    -   **Action:** This will require installing the `twilio-video` package and setting up a Twilio account. A small backend endpoint will also be needed to securely generate access tokens for clients, as recommended by Twilio's security best practices.

## 4. Rationale

This strategy of using specialized, managed services allows us to focus on building a great user experience on the frontend while relying on proven, secure, and scalable solutions for the complex backend functionalities. It significantly reduces development time and long-term maintenance costs.
