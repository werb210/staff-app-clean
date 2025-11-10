import { dedupeRoutes } from "../utils/routeDeduper.js";

export interface IntegrationWebhook {
  method: string;
  path: string;
  description: string;
}

/**
 * Service cataloging third-party integrations and exposed webhook endpoints.
 */
export class IntegrationsService {
  /**
   * Returns the list of registered webhooks, ensuring no duplicates are present.
   */
  async listWebhooks(): Promise<IntegrationWebhook[]> {
    const webhooks: IntegrationWebhook[] = [
      { method: "post", path: "/webhooks/lender/status", description: "Receives lender status updates" },
      { method: "post", path: "/webhooks/lender/status", description: "Duplicate entry for testing" },
      { method: "post", path: "/webhooks/marketing/events", description: "Receives marketing automation events" }
    ];

    return dedupeRoutes(webhooks).map((route) => ({
      method: route.method,
      path: route.path,
      description: webhooks.find((webhook) => webhook.path === route.path && webhook.method.toLowerCase() === route.method.toLowerCase())?.description ?? ""
    }));
  }
}

export const integrationsService = new IntegrationsService();
