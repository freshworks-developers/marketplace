>title: what are modules in global apps?
>tags: modules, global_app
>context:
>content:

# what are modules in global apps?

## Overview
1. Freshworks offers a variety of modules, each tied to a specific Freshworks product and its functionalities.
2. Apps are built by combining various modules depending on the desired features.
3. The combination of modules determines which Freshworks products the app is compatible with and what functionalities are accessible to users with specific subscriptions.

## Examples
- **Freshdesk module:** Interacts with support tickets.
- **Freshservice module:** Manages IT assets and service requests.
- **Common module:** Can be combined with product-specific modules to build cross‑product apps.

---
>title: Types of Freshworks Modules
>tags: modules, global_app, types
>context:
>content:

# Types of Freshworks Modules

## Module Categories
1. **Common Module:**  
   - Provides functionalities like serverless events, request templates, and SMI functions.
   - Enables app development across multiple Freshworks products.
2. **Individual Modules:**  
   - Represent specific Freshworks products (e.g., Freshdesk, Freshservice, Freshsales).
   - Offer product‑related functionalities.

## Usage Scenarios
1. **App Designed for a Specific Product:**  
   - If an app is primarily built for one product (e.g., Freshdesk support tickets), subscribing to that product's SKU activates all features.
2. **App with Modules Across Products:**  
   - Integrating modules for different products (e.g., Freshdesk and Freshservice) means available features depend on subscriptions to each respective product.
3. **App Using the Common Module:**  
   - When combined with other modules, subscription restrictions apply to both common and product‑specific functionalities.

---
>title: what are different modules supported by different freshworks products?
>tags: supported_modules, global_app, freshworks
>context:
>content:

# what are different modules supported by different freshworks products?

## Freshdesk
- **Product‑Specific Modules:**  
  - `support_email` – Handles email-based support interactions.  
  - `support_ticket` – Manages support ticket creation and tracking.  
  - `support_contact` – Manages customer contact details for support.  
  - `support_company` – Stores and manages company information.
  - `support_portal` – Provides a self-service portal for customers.  
  - `support_agent` – Interfaces for agent-specific functionalities.  
- **Common Module Placeholders:**  
  - `full_page_app` – Displays the app in a full-screen view.  
  - `cti_global_sidebar` – Provides a sidebar integration for CTI features.

## Freshservice
- **Product‑Specific Modules:**  
  - `service_ticket` – Handles IT service ticket management.  
  - `service_asset` – Manages IT assets and inventory.  
  - `service_change` – Manages change requests and approvals.  
  - `service_user` – Manages user data within the service context.
- **Common Module Placeholders:**  
  - `full_page_app` – Displays the app in a full-page format.

## Freshsales Suite & Freshsales Classic
- **Product‑Specific Modules:**  
  - `deal` – Tracks sales deals and opportunities.  
  - `appointment` – Manages scheduling and appointments.  
  - `cpq_document` – Manages CPQ-related documents.  
  - `product` – Handles product catalog management.  
  - `contact` – Handles contact management.  
  - `sales_account` – Manages sales accounts and related data.  
  - `sales_activities` - Manages sales activities and related data.  
  - `phone` – Manages phone interactions and call logs.  
  - `task` – Tracks tasks and follow-ups.
  - `user_agent_availability` - User agent availability
- **Additional for Freshsales Classic:**  
  - `lead` – Manages sales leads (only supported in Freshsales Classic).
- **Common Module Placeholders:**  
  - `full_page_app` – Provides a full-screen app experience.  
  - `left_nav_cti` – Integrates CTI features in the sidebar.  
  - `left_nav_chat` – Displays chat functionality in a sidebar.

## Freshcaller
- **Product‑Specific Modules:**  
  - `call` – Manages call initiation and tracking.  
  - `caller_conversation` – Handles call-related conversations.  
  - `caller_metrics` – Displays call performance metrics.  
  - `caller_agent` – Manages caller agent-specific functionalities.  
  - `notification` – Handles notifications related to calling.

## Freshchat
- **Product‑Specific Modules:**  
  - `chat_user` – Manages chat user profiles and settings.  
  - `chat_conversation` – Handles real-time chat conversations.

---
