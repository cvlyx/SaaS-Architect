import { Router } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable, organizationsTable } from "@workspace/db";
import { generateToken } from "../middleware/auth";
import type { AuthPayload } from "../middleware/auth";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, role, organization } = req.body;
    if (!email || !password || !fullName) {
      res.status(400).json({ error: "email, password, and fullName are required" });
      return;
    }

    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create the organization first
    const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const [org] = await db.insert(organizationsTable).values({
      name: organization?.name || `${fullName}'s Org`,
      type: organization?.type || "Private",
      country: organization?.country || "United States",
      city: organization?.city || "Unknown",
      size: organization?.size || "1-10",
      industryPackId: organization?.industryPackId || 1,
      status: "trial",
      trialEndsAt: trialEnd.toISOString(),
    }).returning();

    // Then create the user linked to the organization
    const [user] = await db.insert(usersTable).values({
      fullName,
      email,
      passwordHash,
      role: role || "admin",
      organizationId: org.id,
      status: "active",
    }).returning();

    const payload: AuthPayload = { userId: user.id, organizationId: user.organizationId, role: user.role };
    const token = generateToken(payload);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        status: user.status,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Registration failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (!user || !user.passwordHash) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const payload: AuthPayload = { userId: user.id, organizationId: user.organizationId, role: user.role };
    const token = generateToken(payload);

    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        status: user.status,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Login failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
