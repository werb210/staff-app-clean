export interface MetricPoint {
  name: string;
  value: number;
  collectedAt: string;
}

/**
 * Service responsible for producing analytics metrics for dashboards.
 */
export class AnalyticsService {
  /**
   * Returns aggregated application metrics.
   */
  async getApplicationMetrics(): Promise<MetricPoint[]> {
    const collectedAt = new Date().toISOString();
    return [
      { name: "applications_submitted", value: 120, collectedAt },
      { name: "applications_approved", value: 72, collectedAt },
      { name: "average_funding_amount", value: 27500, collectedAt }
    ];
  }
}

export const analyticsService = new AnalyticsService();
