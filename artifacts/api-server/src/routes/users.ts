import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListUsersQueryParams,
  CreateUserBody,
  GetUserParams,
  UpdateUserParams,
  UpdateUserBody,
  DeleteUserParams,
} from "@workspace/api-zod";

const router = Router();

router.post("/invite", async (req, res) => {
  try {
    const { email, fullName, role, organizationId } = req.body;
    if (!email || !fullName || !organizationId) {
      return res.status(400).json({ error: "email, fullName, organizationId required" });
    }
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing.length > 0) {
      return res.status(409).json({ error: "User with this email already exists" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    const [user] = await db.insert(usersTable).values({
      fullName, email, role: role || "member",
      organizationId, status: "pending",
    }).returning();
    const inviteLink = `${req.protocol}://${req.get("host")}/api/users/accept-invite?token=${token}&userId=${user.id}`;
    req.log.info({ inviteLink }, "Team invite generated");
    res.status(201).json({ user, inviteLink });
  } catch (err: any) {
    req.log.error({ err }, "Failed to invite user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  const parsed = ListUsersQueryParams.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "Invalid query" });

  try {
    let query = db.select().from(usersTable);
    if (parsed.data.organizationId) {
      query = query.where(eq(usersTable.organizationId, parsed.data.organizationId)) as typeof query;
    }
    const users = await query.orderBy(usersTable.createdAt);
    return res.json(users);
  } catch (err) {
    req.log.error({ err }, "Failed to list users");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const parsed = CreateUserBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid body", details: parsed.error });

  try {
    const { password, ...userData } = parsed.data;
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;
    const [user] = await db
      .insert(usersTable)
      .values({ ...userData, passwordHash })
      .returning();
    return res.status(201).json(user);
  } catch (err) {
    req.log.error({ err }, "Failed to create user");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const parsed = GetUserParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid id" });

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, parsed.data.id));
    if (!user) return res.status(404).json({ error: "Not found" });
    return res.json(user);
  } catch (err) {
    req.log.error({ err }, "Failed to get user");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  const paramsParsed = UpdateUserParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) return res.status(400).json({ error: "Invalid id" });
  const bodyParsed = UpdateUserBody.safeParse(req.body);
  if (!bodyParsed.success) return res.status(400).json({ error: "Invalid body" });

  try {
    const [user] = await db
      .update(usersTable)
      .set(bodyParsed.data)
      .where(eq(usersTable.id, paramsParsed.data.id))
      .returning();
    if (!user) return res.status(404).json({ error: "Not found" });
    return res.json(user);
  } catch (err) {
    req.log.error({ err }, "Failed to update user");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const parsed = DeleteUserParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid id" });

  try {
    await db.delete(usersTable).where(eq(usersTable.id, parsed.data.id));
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete user");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
