import auditLogsRepo from "../db/repositories/auditLogs.repo.js";

export const auditService = {
  async log(event: string, payload: any, userId: string | null = null) {
    return auditLogsRepo.create({
      eventType: event,
      details: payload,
      userId,
      createdAt: new Date(),
    });
  },

  async list(limit = 100) {
    const rows = await auditLogsRepo.findMany({});
    return rows.slice(0, limit);
  },
};

export default auditService;
