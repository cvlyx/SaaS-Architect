import { describe, it, expect } from "vitest";

describe("health route", () => {
  it("should export a router", async () => {
    const health = await import("./health");
    expect(health.default).toBeDefined();
    expect(typeof health.default).toBe("function");
  });
});
