// server/src/services/notificationsService.ts
export const notificationsService = {
  async list() {
    return [
      { id: 1, message: "Test notification", ts: Date.now() },
      { id: 2, message: "Welcome to Boreal", ts: Date.now() },
    ];
  },
};
