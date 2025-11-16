// server/src/services/authService.ts
export const authService = {
  async login(email: string, password: string) {
    if (email === "todd.w@boreal.financial" && password === "1Sucker1!") {
      return {
        ok: true,
        token: "mock-jwt-token",
        user: { email, role: "admin" },
      };
    }

    return { ok: false, error: "Invalid credentials" };
  },
};
