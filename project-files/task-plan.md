Of course. After a thorough evaluation of the previous plan against the original specification and your pointed feedback, I have produced a revised, more comprehensive, and highly-detailed end-to-end task plan.

This updated version systematically addresses:
*   **Complete Tech Stack**: Each step now explicitly mentions the technology being implemented.
*   **Logical Dependencies**: The flow is structured to be built incrementally, with each step relying on the completion of the previous ones.
*   **UI/UX States**: Every frontend task now includes specific considerations for loading, empty, success, and error states, ensuring a polished user experience.
*   **Deployment & Operations**: A new section has been added to cover the CI/CD pipeline and environment configuration as specified.
*   **External Configurations**: Critical setup tasks outside the codebase (e.g., Supabase extensions, Meta Developer Apps) are now included as explicit, actionable steps.
*   **UX/UI Considerations**: Each step now features a dedicated line on the user experience impact, connecting backend tasks to frontend value and ensuring user-centric development.

Here is the complete, updated plan.

## Section 1: Project Foundation & Core Infrastructure

This section establishes the entire project's structure, local development environment, and critical database configurations, including security.

- [ ] Step 1: Initialize Monorepo and Supabase Project
  - **Task**: Set up the project structure for both frontend (Next.js) and backend (FastAPI). Initialize a new Supabase project which will serve as our database, authentication provider, and storage solution. Configure initial environment variables.
  - **Files**:
    - `chidi-frontend/package.json`: Initialize a Next.js 14 project with the App Router.
    - `chidi-frontend/tsconfig.json`: Default TypeScript configuration.
    - `chidi-frontend/.env.local.example`: Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
    - `chidi-backend/pyproject.toml`: Initialize a Python project using Poetry for dependency management.
    - `chidi-backend/.env.example`: Add `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`.
    - `README.md`: Create a root README with detailed setup instructions.
  - **Step Dependencies**: None
  - **UX/UI**: A clear README provides a smooth developer onboarding experience, reducing setup friction.
  - **User Instructions**:
    1.  Create a new project on [Supabase](https://supabase.com).
    2.  From the project's API settings, retrieve the Project URL, anon key, and service role key.
    3.  From the Database settings, get the connection string (URI).
    4.  Create `.env.local` and `.env` files from the examples and populate them with the retrieved credentials. Generate a secure secret for `JWT_SECRET`.

- [ ] Step 2: Configure Docker and Microservice Structure
  - **Task**: Create the `docker-compose.yml` file to define and orchestrate the local development environment. This will include initial services for the API Gateway, the database (PostgreSQL), and the cache/broker (Redis), reflecting the microservices architecture.
  - **Files**:
    - `docker-compose.yml`: Define services for `postgres`, `redis`, and an initial `api-gateway` service as specified in section 8.1.
    - `chidi-backend/services/api-gateway/Dockerfile`: A generic Python Dockerfile for FastAPI services.
    - `chidi-backend/services/api-gateway/app/main.py`: A placeholder "Hello World" FastAPI app to confirm the setup works.
    - `chidi-backend/.dockerignore`: Add common files to ignore (`__pycache__`, `.venv`, etc.).
  - **Step Dependencies**: Step 1
  - **UX/UI**: A one-command `docker-compose up` provides a frictionless local setup for all developers.
  - **User Instructions**:
    1.  Ensure Docker and Docker Compose are installed.
    2.  Run `docker-compose up --build` from the project root.
    3.  Verify the API gateway is running by accessing `http://localhost:8000`.

- [ ] Step 3: Implement Initial Database Schema with RLS
  - **Task**: Set up Alembic for database migrations. Create the first migration for core tables: `user_contexts`, `conversations`, and `messages`. Crucially, implement Row-Level Security (RLS) policies to enforce strict data isolation between users from day one.
  - **Files**:
    - `chidi-backend/shared/database/migrations/env.py`: Configure Alembic.
    - `chidi-backend/shared/database/migrations/versions/001_initial_schema.py`: An Alembic migration script with `CREATE TABLE` statements for `user_contexts`, `conversations`, `messages`, and their corresponding RLS policies as defined in section 4.1.
    - `chidi-backend/shared/database/models.py`: Define the SQLAlchemy models for these tables.
    - `chidi-backend/shared/database/connection.py`: Create the `get_db` dependency for managing database sessions.
    - `chidi-backend/alembic.ini`: Configure Alembic to find the migration scripts.
  - **Step Dependencies**: Step 1
  - **UX/UI**: Ensuring data isolation from the start builds user trust, even if this security layer is invisible to them.
  - **User Instructions**:
    1.  Install Alembic (`poetry add alembic sqlalchemy psycopg2-binary`).
    2.  Run `poetry run alembic upgrade head` to apply the migration to your database.
    3.  Verify in the Supabase table editor that the tables and RLS policies have been created successfully.

- [ ] Step 4: Setup Frontend Design System with Shadcn/ui
  - **Task**: Configure the Next.js project with Tailwind CSS and Shadcn/ui. Define the core design tokens (colors, typography) from the spec, and create the main application layout.
  - **Files**:
    - `chidi-frontend/tailwind.config.ts`: Extend the theme with the color palette, fonts, and spacing from section 7.2.
    - `chidi-frontend/styles/globals.css`: Import Tailwind CSS base styles.
    - `chidi-frontend/app/layout.tsx`: Create the root layout, applying the primary font and base background colors.
    - `chidi-frontend/lib/utils.ts`: Standard utility file for `cn` helper from Shadcn/ui.
    - `chidi-frontend/components.json`: The configuration file generated by the Shadcn/ui CLI.
    - `chidi-frontend/shared/components/layouts/DashboardLayout.tsx`: Create the main dashboard layout component with a placeholder for a sidebar and main content area.
  - **Step Dependencies**: Step 1
  - **UX/UI**: A consistent design system ensures a professional and predictable user interface from the very first component.
  - **User Instructions**:
    1.  Follow the Shadcn/ui installation guide for Next.js.
    2.  Run `npx shadcn-ui@latest init`.
    3.  Install initial components: `button`, `card`, `input`, `label`, `toast`, `sonner`.
    4.  Start the dev server (`npm run dev`) to confirm the setup.

## Section 2: Authentication & Conversational Onboarding

This section implements the complete user authentication flow and the initial conversational onboarding experience.

- [ ] Step 5: Implement User Auth UI and Supabase Integration
  - **Task**: Build the frontend components for user signup and login using **Supabase Auth**. Account for loading, success, and error states during the auth process to provide clear user feedback.
  - **Files**:
    - `chidi-frontend/features/auth/components/SignupForm.tsx`: A client component with a form for registration.
    - `chidi-frontend/features/auth/components/LoginForm.tsx`: A client component for login.
    - `chidi-frontend/app/(auth)/signup/page.tsx`: Route to render the `SignupForm`.
    - `chidi-frontend/app/(auth)/login/page.tsx`: Route to render the `LoginForm`.
    - `chidi-frontend/lib/supabase/client.ts`: A singleton instance of the Supabase client for the browser.
    - `chidi-frontend/features/auth/hooks/useAuth.ts`: A custom hook to abstract auth logic (`signUp`, `signInWithPassword`, `signOut`) and manage auth state (user, session, loading).
    - `chidi-frontend/app/auth/callback/route.ts`: A route handler to process the OAuth callback from Supabase after email verification.
  - **Step Dependencies**: Step 4
  - **UX/UI**: Immediate visual feedback during login/signup (e.g., disabled buttons, spinners, error toasts) prevents user confusion and frustration.
  - **User Instructions**:
    1.  Navigate to `/signup`. The form should be interactive.
    2.  Try to sign up. A toast should appear confirming that a verification email has been sent, and the submit button should be disabled.
    3.  Click the link in the email, which should redirect you back to the app and log you in.
    4.  Check the Supabase dashboard to confirm the user was created.

- [ ] Step 6: Backend Auth and User Context Initialization
  - **Task**: Implement the backend logic for JWT verification and creating a user's isolated context in the database upon their first successful authentication.
  - **Files**:
    - `chidi-backend/shared/auth/jwt_handler.py`: A utility to verify Supabase JWTs using the project's JWKS URL.
    - `chidi-backend/shared/auth/dependencies.py`: The `get_current_user` FastAPI dependency to protect routes.
    - `chidi-backend/services/api-gateway/app/routers/users.py`: A new router with an endpoint `POST /users/context` that creates the initial `user_contexts` record, as specified in section 3.1. This endpoint must be idempotent.
    - `chidi-backend/services/api-gateway/app/main.py`: Mount the new `users` router.
    - `chidi-frontend/features/auth/hooks/useAuth.ts`: Update the hook to call the `/users/context` endpoint after a successful sign-in.
  - **Step Dependencies**: Step 3, Step 5
  - **UX/UI**: A seamless, automatic context creation after signup makes the user feel the system is 'ready for them' without extra steps.
  - **User Instructions**:
    1.  After a new user signs up and logs in for the first time, check the `user_contexts` table.
    2.  A new row corresponding to the user's ID should exist, with `onboarding_status` set to 'pending'.

- [ ] Step 7: Build Conversational Onboarding Interface
  - **Task**: Create the chat UI for the conversational onboarding. This component will guide the user through a series of questions to learn about their business, handling all relevant UI states.
  - **Files**:
    - `chidi-frontend/app/(dashboard)/onboarding/page.tsx`: The route that hosts the onboarding chat flow.
    - `chidi-frontend/features/chat/components/ChatInterface.tsx`: A reusable chat UI component (`'use client'`). **UI States**: The input field and send button must be disabled while waiting for an AI response.
    - `chidi-frontend/features/chat/components/MessageBubble.tsx`: Renders individual messages for the user and assistant.
    - `chidi-frontend/features/onboarding/components/OnboardingFlow.tsx`: A client component that orchestrates the onboarding conversation. It will contain the logic for asking questions, receiving answers, and progressing the flow.
    - `chidi-frontend/store/onboarding.store.ts`: A Zustand store to temporarily hold onboarding data before it's sent to the backend.
  - **Step Dependencies**: Step 6
  - **UX/UI**: A familiar, WhatsApp-like chat interface for onboarding feels intuitive and less like a tedious form.
  - **User Instructions**:
    1.  A newly signed-up user should be redirected to `/onboarding` after login.
    2.  The chat interface should appear with a welcome message from CHIDI.
    3.  You can interact with the chat, and your responses should be displayed correctly.

## Section 3: AI Chat, Context, and Background Tasks

This section implements the core AI functionality, including real-time chat, vector context, and setting up background tasks with Celery.

- [ ] Step 8: Setup Celery and Redis for Background Tasks
  - **Task**: Configure **Celery** with **Redis** as the broker to handle asynchronous and long-running tasks. This is essential for processing webhooks and other non-blocking operations mentioned in the architecture, ensuring the API remains responsive.
  - **Files**:
    - `chidi-backend/workers/celery_app.py`: Define the Celery application instance and configure it to use Redis.
    - `chidi-backend/workers/tasks/example_task.py`: Create a simple example task to verify the setup.
    - `chidi-backend/services/api-gateway/app/routers/tasks.py`: Add a test endpoint to trigger the example Celery task.
    - `chidi-backend/workers/Dockerfile`: A Dockerfile specifically for the Celery workers.
    - `docker-compose.yml`: Add a new `worker` service that uses the `workers/Dockerfile`.
  - **Step Dependencies**: Step 2
  - **UX/UI**: Background tasks ensure the UI remains fast and responsive, preventing frustrating loading spinners on long operations.
  - **User Instructions**:
    1.  Add `celery` and `redis` to the backend's `pyproject.toml`.
    2.  Rebuild and restart the Docker environment (`docker-compose up --build`).
    3.  Call the test endpoint from the API gateway and check the logs of the `worker` container to see the task being executed.

- [ ] Step 9: Implement WebSocket Chat Service
  - **Task**: Create a dedicated `chat-service` microservice with a **FastAPI WebSocket** endpoint. This service will manage real-time connections for the AI chat.
  - **Files**:
    - `chidi-backend/services/chat/app/main.py`: The FastAPI app for the chat service.
    - `chidi-backend/services/chat/app/websocket/manager.py`: The `ChatManager` class for handling WebSocket connections, as per section 3.2.
    - `chidi-backend/services/chat/app/websocket/router.py`: A router with the `/ws/chat/{user_id}` endpoint.
    - `chidi-backend/services/chat/Dockerfile`: Dockerfile for this service.
    - `docker-compose.yml`: Add the `chat-service` to the configuration.
  - **Step Dependencies**: Step 2
  - **UX/UI**: A stable WebSocket connection is the invisible foundation for a real-time, 'live' chat experience.
  - **User Instructions**:
    1.  Rebuild your Docker environment to start the `chat-service`.
    2.  Use a WebSocket client tool to connect to `ws://localhost:8001/ws/chat/test-user` and verify that messages are echoed back.

- [ ] Step 10: Integrate Frontend Chat with OpenAI & Fallback
  - **Task**: Connect the frontend chat UI to the WebSocket. Integrate the `chat-service` with **OpenAI** to provide AI-generated responses. Implement the fallback mechanism to use **Anthropic** if OpenAI fails.
  - **Files**:
    - `chidi-frontend/features/chat/hooks/useWebSocket.ts`: A hook to manage the WebSocket connection lifecycle. **UI States**: Must handle and expose connection status (`connecting`, `open`, `closed`, `error`) to the UI.
    - `chidi-frontend/features/chat/components/ChatInterface.tsx`: Update to use the `useWebSocket` hook and display AI responses. Show a connection status indicator (e.g., a small dot or toast) based on the hook's state.
    - `chidi-frontend/features/chat/components/TypingIndicator.tsx`: A component to show while waiting for the AI response (the "loading" state for a message).
    - `chidi-backend/services/chat/app/integrations/openai.py`: The `OpenAIService` from section 5.2, including the fallback logic to call the Anthropic API in a `try...except` block.
    - `chidi-backend/services/chat/app/integrations/anthropic.py`: A new service for interacting with the Anthropic Claude API.
    - `chidi-backend/services/chat/app/websocket/manager.py`: Update `handle_message` to call the AI service.
    - `chidi-backend/.env.example`: Add `OPENAI_API_KEY` and `ANTHROPIC_API_KEY`.
  - **Step Dependencies**: Step 7, Step 9
  - **UX/UI**: A typing indicator manages user expectations and makes the AI feel more interactive and human-like.
  - **User Instructions**:
    1.  Set your API keys in the backend `.env` file.
    2.  Go to a chat interface in the app and ask a question.
    3.  You should see a typing indicator followed by a response from the AI.
    4.  To test the fallback, temporarily invalidate the OpenAI key and verify that you still get a response (this time from Anthropic).

- [ ] Step 11: Implement Vector Context for Business-Aware AI
  - **Task**: Enable **pgvector** in Supabase and create the `business_embeddings` table. Implement the logic to generate embeddings for business rules and use vector search to retrieve relevant context to augment the AI's prompts.
  - **Files**:
    - `chidi-backend/shared/database/migrations/versions/002_add_pgvector_and_embeddings.py`: A migration to create the `business_embeddings` table with an IVFFlat index (see section 4.1).
    - `chidi-backend/shared/database/models.py`: Add the `BusinessEmbedding` SQLAlchemy model.
    - `chidi-backend/pyproject.toml`: Add `sqlalchemy-pgvector`.
    - `chidi-backend/services/chat/app/features/rules/extractor.py`: Defines function calling schemas for extracting structured business rules from text.
    - `chidi-backend/services/chat/app/features/context/manager.py`: The `ContextManager` class. Implement `add_business_context` to generate and store embeddings, and `get_active_context` to perform vector search.
    - `chidi-backend/services/chat/app/websocket/manager.py`: Update to use the `ContextManager` to fetch context before calling the LLM.
  - **Step Dependencies**: Step 3, Step 10
  - **UX/UI**: The 'aha!' moment when the AI correctly recalls specific business details builds immense product value and user trust.
  - **User Instructions**:
    1.  **External Config**: In your Supabase project's "Database" -> "Extensions" page, search for "vector" and enable it.
    2.  Run the Alembic migration (`poetry run alembic upgrade head`).
    3.  During onboarding, provide a business rule like "We offer a 10% discount on orders over $100."
    4.  Check the `business_embeddings` table to see the new entry.
    5.  In a new chat, ask "Do I get a discount if I spend $120?". CHIDI should now answer correctly based on the context you provided.

## Section 4: Inventory Management

This section builds the complete inventory management feature, including a UI, API, and conversational updates.

- [ ] Step 12: Build Inventory API and Database Schema
  - **Task**: Create the `inventory-service` microservice. Define and migrate the schema for `products`, `product_variants`, and `stock_movements`. Implement the full suite of CRUD API endpoints.
  - **Files**:
    - `chidi-backend/services/inventory/app/main.py`: The main FastAPI app for the service.
    - `chidi-backend/shared/database/migrations/versions/003_add_inventory_tables.py`: Migration for all inventory-related tables with RLS policies, as per section 4.1.
    - `chidi-backend/shared/database/models.py`: Add the corresponding SQLAlchemy models.
    - `chidi-backend/services/inventory/app/features/products/router.py`: The router for `/products` endpoints.
    - `chidi-backend/services/inventory/app/features/products/service.py`: Business logic for product management.
    - `chidi-backend/services/inventory/app/features/products/schemas.py`: Pydantic schemas for API validation.
    - `chidi-backend/services/api-gateway/app/main.py`: Add routing rules to forward `/api/inventory/*` to the `inventory-service`.
    - `docker-compose.yml`: Add the `inventory-service`.
  - **Step Dependencies**: Step 3
  - **UX/UI**: A robust and fast API ensures the inventory dashboard will feel snappy and reliable to the user.
  - **User Instructions**:
    1.  Run the database migration.
    2.  Rebuild the Docker environment to start the new service.
    3.  Use an API client (e.g., Postman) to test the `POST`, `GET`, `PATCH`, and `DELETE` endpoints for `/api/inventory/products`.

- [ ] Step 13: Build Frontend Inventory Dashboard
  - **Task**: Create the complete UI for inventory management. This includes a product list with loading/empty/error states, and a form for adding/editing products with client-side validation.
  - **Files**:
    - `chidi-frontend/app/(dashboard)/inventory/page.tsx`: Main page to display the product list.
    - `chidi-frontend/app/(dashboard)/inventory/new/page.tsx`: Route for the new product form.
    - `chidi-frontend/app/(dashboard)/inventory/[productId]/edit/page.tsx`: Dynamic route for the product edit form.
    - `chidi-frontend/features/inventory/components/ProductList.tsx`: A client component to display products in a data table. **UI States**: Implement a skeleton loader for the loading state, a message with a "Add Product" CTA for the empty state, and a clear error message on API failure.
    - `chidi-frontend/features/inventory/components/ProductForm.tsx`: The form for creating/editing products. **UI States**: Must disable the "Save" button during submission and display any validation errors.
    - `chidi-frontend/features/inventory/hooks/useProducts.ts`: A **React Query** hook to fetch and manage product data, simplifying state management.
    - `chidi-frontend/features/inventory/services/inventory.service.ts`: Typed functions for making API calls to the inventory service.
  - **Step Dependencies**: Step 12
  - **UX/UI**: An intelligent empty state with a clear call-to-action guides new users on how to get started with their inventory.
  - **User Instructions**:
    1.  Navigate to `/inventory`. You should see a loading skeleton, then either an empty state message or a list of your products.
    2.  Use the "Add Product" button to open the form, fill it out, and save. The new product should appear in the list without a page refresh.
    3.  Click a product to edit it.

- [ ] Step 14: Implement Conversational Inventory Updates
  - **Task**: Leverage **OpenAI Function Calling** to allow users to manage inventory through conversation. The AI should translate commands like "I have 10 new blue t-shirts in size M" into API calls to the inventory service.
  - **Files**:
    - `chidi-backend/services/chat/app/features/inventory/functions.py`: Define function calling schemas for `add_product`, `update_stock`, and `check_stock`.
    - `chidi-backend/services/chat/app/features/inventory/handler.py`: A handler that executes the functions by making internal HTTP requests to the `inventory-service`.
    - `chidi-backend/services/chat/app/websocket/manager.py`: Update the WebSocket manager to include the inventory functions in its list of available tools for the LLM.
    - `chidi-backend/services/chat/app/integrations/internal_api_client.py`: A client for making authenticated service-to-service requests.
  - **Step Dependencies**: Step 11, Step 13
  - **UX/UI**: Managing inventory via conversation is a 'magic' moment that fulfills the core product promise of 'no technical expertise needed'.
  - **User Instructions**:
    1.  Go to the main chat interface with CHIDI.
    2.  Type "Add a new product called 'Winter Scarf' that costs $25 and I have 50 in stock."
    3.  CHIDI should confirm the action.
    4.  Navigate to the `/inventory` dashboard to verify that the "Winter Scarf" has been added.

## Section 5: Social Media Integration & Automated Responses

This section connects CHIDI to external social media platforms and implements the core automated response logic.

- [ ] Step 15: External - Set Up Meta Developer Application
  - **Task**: This is a non-code configuration step. Create and configure a Meta Developer App to get the necessary credentials and permissions for the Instagram Business API integration.
  - **Files**: None. This is a configuration task in an external system.
  - **Step Dependencies**: Step 6 (to have a user account to associate with)
  - **UX/UI**: A clear documentation guide on how to perform these external steps is crucial for user success.
  - **User Instructions**:
    1.  Go to `developers.facebook.com` and create a new App of type "Business".
    2.  From the App Dashboard, add the "Instagram Graph API" and "Webhooks" products.
    3.  Note down the App ID and App Secret.
    4.  Under "Instagram Graph API" -> "Permissions", add `instagram_basic`, `instagram_manage_messages`, and `pages_show_list`.

- [ ] Step 16: Implement Social Media Service, Schema, and OAuth
  - **Task**: Create the `social-service` microservice and schema. Build the backend flow for connecting an Instagram account using OAuth2, and create the frontend UI to initiate this flow.
  - **Files**:
    - `chidi-backend/services/social/app/main.py`: The FastAPI app for the `social-service`.
    - `chidi-backend/shared/database/migrations/versions/004_add_social_tables.py`: Migration for `social_connections` and `social_messages` tables with RLS, per section 4.1.
    - `chidi-backend/shared/database/models.py`: Corresponding SQLAlchemy models.
    - `docker-compose.yml`: Add the `social-service`.
    - `chidi-frontend/app/(dashboard)/integrations/page.tsx`: UI for connection management. **UI States**: The "Connect" button should show a "Connecting..." state, and the UI should update to a "Connected" status upon success.
    - `chidi-backend/services/social/app/features/instagram/oauth.py`: Implements the server-side OAuth flow (generating auth URL, handling callback, storing tokens securely).
    - `chidi-backend/services/api-gateway/app/main.py`: Route `/api/social/*` requests to the `social-service`.
  - **Step Dependencies**: Step 3, Step 15
  - **UX/UI**: A simple 'Connect' button that handles a complex OAuth flow in the background abstracts away all technical complexity.
  - **User Instructions**:
    1.  Run the database migration and rebuild Docker.
    2.  Navigate to the `/integrations` page and click "Connect Instagram." You should be redirected to the Instagram/Facebook auth screen.
    3.  After authorizing, check the `social_connections` table to see your new connection and encrypted token.

- [ ] Step 17: Implement Secure Webhook and Asynchronous Processing
  - **Task**: Implement a secure webhook endpoint that verifies incoming requests using HMAC-SHA256 signatures. Offload the message processing to a Celery worker to ensure the webhook responds instantly.
  - **Files**:
    - `chidi-backend/services/social/app/security/webhook_verification.py`: A dependency to verify the `X-Hub-Signature-256` header, per section 3.3.
    - `chidi-backend/services/social/app/features/instagram/webhooks.py`: The webhook endpoint (`POST /api/social/webhooks/instagram`) that uses the verification dependency and pushes valid messages to a Redis queue.
    - `chidi-backend/workers/tasks/social_processing.py`: The Celery task `process_social_message`, as detailed in section 3.3, which will contain the full response logic.
    - `chidi-backend/services/social/app/features/instagram/api_client.py`: A client to send a message back via the Instagram Graph API.
    - `chidi-backend/shared/event_bus.py`: A utility to publish an `escalation_required` event to Redis Pub/Sub if confidence is low.
  - **Step Dependencies**: Step 8, Step 11, Step 16
  - **UX/UI**: Confidence-based escalation builds trust by showing the system knows its own limits and won't "go rogue" on customer messages.
  - **User Instructions**:
    1.  Configure the webhook URL in your Meta app settings to point to your ngrok tunnel (for local dev). Send a test webhook to verify.
    2.  Send a DM to your connected Instagram Business account. Check the Celery worker logs to see the task execute.
    3.  If confidence is high, you'll get an automated reply on Instagram. If low, an escalation event is fired.

## Section 6: Real-time Notifications & Live Dashboard

This final section builds the system for real-time user notifications and a live monitoring dashboard.

- [ ] Step 18: Implement Notification Service with SSE
  - **Task**: Create the `notification-service` that provides a **Server-Sent Events (SSE)** stream for real-time, one-way communication to the client. This service will listen to events on the Redis Pub/Sub bus.
  - **Files**:
    - `chidi-backend/services/notification/app/main.py`: The FastAPI app for the service.
    - `chidi-backend/services/notification/app/sse/handler.py`: The SSE endpoint (`/api/notifications/stream`) that subscribes to a user-specific Redis channel and yields events to the client, as specified in section 3.5.
    - `docker-compose.yml`: Add the `notification-service`.
    - `chidi-backend/services/api-gateway/app/main.py`: Route `/api/notifications/*` to the `notification-service`.
  - **Step Dependencies**: Step 8
  - **UX/UI**: Server-Sent Events provide instant notifications without the user needing to constantly refresh the page.
  - **User Instructions**:
    1.  Rebuild the Docker environment to start the `notification-service`.
    2.  Use a client tool or a simple HTML page with JavaScript's `EventSource` to connect to the stream.
    3.  Manually publish a message to the user's Redis channel (`redis-cli PUBLISH notifications:<user_id> '{"message": "hello"}'`). The message should appear in your client.

- [ ] Step 19: Build Frontend Notification Center
  - **Task**: Create a `NotificationCenter` component in the frontend that connects to the SSE stream. It should display incoming notifications and manage read/unread states.
  - **Files**:
    - `chidi-frontend/features/notifications/components/NotificationCenter.tsx`: A UI component, likely in a popover. **UI States**: Must show an empty state when no notifications are present. Individual notifications need a visual distinction for read vs. unread status.
    - `chidi-frontend/features/notifications/hooks/useNotifications.ts`: A hook that manages the `EventSource` connection and the list of notifications.
    - `chidi-frontend/features/notifications/components/EscalationNotificationToast.tsx`: A specific toast component (using `sonner`) for high-priority escalation notifications.
    - `chidi-frontend/shared/components/layouts/DashboardLayout.tsx`: Add the `NotificationCenter` to the header of the main layout.
  - **Step Dependencies**: Step 17, Step 18
  - **UX/UI**: Actionable, real-time toast notifications allow the user to immediately jump to critical issues without friction.
  - **User Instructions**:
    1.  Trigger an escalation event by sending an ambiguous message to your connected Instagram account.
    2.  A notification bell in the UI header should show a badge, and a toast should appear on screen.
    3.  Clicking the bell should open the popover showing the detailed notification.

- [ ] Step 20: Create the Live Dashboard
  - **Task**: Build the main dashboard page that provides a real-time overview of business activity, with appropriate states for data fetching.
  - **Files**:
    - `chidi-frontend/app/(dashboard)/page.tsx`: The main dashboard page.
    - `chidi-frontend/features/dashboard/components/Dashboard.tsx`: Main dashboard component that orchestrates its children. **UI States**: The entire dashboard should show a skeleton loader on initial load. Each individual card/widget must handle its own error state to prevent the whole page from crashing.
    - `chidi-frontend/features/dashboard/components/ActiveConversations.tsx`: A component that lists ongoing conversations.
    - `chidi-frontend/features/dashboard/components/MetricCard.tsx`: A reusable component to display key stats.
    - `chidi-frontend/features/dashboard/services/dashboard.service.ts`: An API service to fetch the initial data for the dashboard.
    - `chidi-backend/services/api-gateway/app/routers/dashboard.py`: An endpoint to aggregate and return the data needed for the dashboard.
  - **Step Dependencies**: Step 19
  - **UX/UI**: A dashboard with skeleton loaders feels modern and responsive, providing immediate structure even before data arrives.
  - **User Instructions**:
    1.  Navigate to the root URL after logging in (`/`).
    2.  The dashboard should display loading skeletons, then populate with widgets showing initial data.
    3.  When a new message is escalated, the "Active Conversations" list should update to show the new item requiring review.

## Section 7: Deployment & Operations

This section covers the final steps to make the application production-ready, focusing on CI/CD and operational stability.

- [ ] Step 21: Configure CI/CD Pipeline
  - **Task**: Create a **GitHub Actions** workflow to automate testing and deployment. The pipeline should run tests on every push/PR and deploy the services to the hosting environment (**Render.com**) on a merge to the `main` branch.
  - **Files**:
    - `.github/workflows/deploy.yml`: A workflow file that includes jobs for `test` (running pytest and vitest) and `deploy` (using Render's deploy hooks or CLI), as per section 8.2.
  - **Step Dependencies**: Step 20 (a deployable application)
  - **UX/UI**: For developers, an automated CI/CD pipeline dramatically improves productivity and reduces the risk of manual deployment errors.
  - **User Instructions**:
    1.  Create deploy hooks for your services in the Render.com dashboard.
    2.  Add these hooks as secrets to your GitHub repository.
    3.  Push a change to a feature branch to create a PR. Verify that the tests run automatically.
    4.  Merge the PR to `main` and verify that the deployment is triggered in Render.

- [ ] Step 22: Finalize Environment Configuration & Monitoring
  - **Task**: Implement robust configuration management for different environments (dev, staging, prod). Integrate an error tracking service like **Sentry** to monitor the application's health.
  - **Files**:
    - `chidi-backend/config.py`: A Pydantic settings management file that loads configuration from environment variables, as specified in section 8.2.
    - `chidi-frontend/lib/config.ts`: A similar configuration setup for the frontend.
    - `render.yaml`: (Optional but recommended) Define your infrastructure-as-code for Render to manage services and environment variables.
    - `chidi-backend/main.py` (all services): Add Sentry SDK initialization.
    - `chidi-frontend/app/layout.tsx`: Add Sentry SDK initialization for the frontend.
  - **Step Dependencies**: Step 21
  - **UX/UI**: Proactive error monitoring with Sentry allows developers to find and fix bugs before most users even notice them.
  - **User Instructions**:
    1.  Create a project in Sentry for both frontend and backend.
    2.  Add the DSNs to your production environment variables in Render.
    3.  Deploy the changes.
    4.  Intentionally trigger an error in the application and verify that it appears in your Sentry dashboard.