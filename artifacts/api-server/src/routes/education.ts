import { Router } from "express";
import { db } from "@workspace/db";
import { eq, and, count } from "drizzle-orm";
import {
  educationStudents,
  educationTeachers,
  educationClasses,
  educationEnrollments,
  educationAttendance,
  educationAssignments,
  educationGrades,
} from "@workspace/db";

const router = Router();

// ── Students ──
router.get("/students", async (req, res) => {
  try {
    const orgId = Number(req.query.organizationId);
    let query = db.select().from(educationStudents);
    if (orgId) query = query.where(eq(educationStudents.organizationId, orgId)) as typeof query;
    const rows = await query.orderBy(educationStudents.lastName);
    res.json(rows);
  } catch (err) { req.log.error({ err }, "Failed to list students"); res.status(500).json({ error: "Internal server error" }); }
});

router.post("/students", async (req, res) => {
  try {
    const { organizationId, firstName, lastName, email, phone, dateOfBirth, gradeLevel } = req.body;
    if (!organizationId || !firstName || !lastName) return res.status(400).json({ error: "organizationId, firstName, lastName required" });
    const [row] = await db.insert(educationStudents).values({ organizationId, firstName, lastName, email, phone, dateOfBirth, gradeLevel }).returning();
    res.status(201).json(row);
  } catch (err) { req.log.error({ err }, "Failed to create student"); res.status(500).json({ error: "Internal server error" }); }
});

router.get("/students/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(educationStudents).where(eq(educationStudents.id, Number(req.params.id)));
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) { req.log.error({ err }, "Failed to get student"); res.status(500).json({ error: "Internal server error" }); }
});

router.patch("/students/:id", async (req, res) => {
  try {
    const [row] = await db.update(educationStudents).set(req.body).where(eq(educationStudents.id, Number(req.params.id))).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) { req.log.error({ err }, "Failed to update student"); res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/students/:id", async (req, res) => {
  try {
    await db.delete(educationStudents).where(eq(educationStudents.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) { req.log.error({ err }, "Failed to delete student"); res.status(500).json({ error: "Internal server error" }); }
});

// ── Teachers ──
router.get("/teachers", async (req, res) => {
  try {
    const orgId = Number(req.query.organizationId);
    let query = db.select().from(educationTeachers);
    if (orgId) query = query.where(eq(educationTeachers.organizationId, orgId)) as typeof query;
    const rows = await query.orderBy(educationTeachers.lastName);
    res.json(rows);
  } catch (err) { req.log.error({ err }, "Failed to list teachers"); res.status(500).json({ error: "Internal server error" }); }
});

router.post("/teachers", async (req, res) => {
  try {
    const { organizationId, firstName, lastName, email, phone, subject } = req.body;
    if (!organizationId || !firstName || !lastName || !subject) return res.status(400).json({ error: "organizationId, firstName, lastName, subject required" });
    const [row] = await db.insert(educationTeachers).values({ organizationId, firstName, lastName, email, phone, subject }).returning();
    res.status(201).json(row);
  } catch (err) { req.log.error({ err }, "Failed to create teacher"); res.status(500).json({ error: "Internal server error" }); }
});

router.get("/teachers/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(educationTeachers).where(eq(educationTeachers.id, Number(req.params.id)));
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) { req.log.error({ err }, "Failed to get teacher"); res.status(500).json({ error: "Internal server error" }); }
});

router.patch("/teachers/:id", async (req, res) => {
  try {
    const [row] = await db.update(educationTeachers).set(req.body).where(eq(educationTeachers.id, Number(req.params.id))).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) { req.log.error({ err }, "Failed to update teacher"); res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/teachers/:id", async (req, res) => {
  try {
    await db.delete(educationTeachers).where(eq(educationTeachers.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) { req.log.error({ err }, "Failed to delete teacher"); res.status(500).json({ error: "Internal server error" }); }
});

// ── Classes ──
router.get("/classes", async (req, res) => {
  try {
    const orgId = Number(req.query.organizationId);
    let query = db.select().from(educationClasses);
    if (orgId) query = query.where(eq(educationClasses.organizationId, orgId)) as typeof query;
    const rows = await query.orderBy(educationClasses.name);
    res.json(rows);
  } catch (err) { req.log.error({ err }, "Failed to list classes"); res.status(500).json({ error: "Internal server error" }); }
});

router.post("/classes", async (req, res) => {
  try {
    const { organizationId, name, subject, teacherId, room, schedule, maxCapacity } = req.body;
    if (!organizationId || !name || !subject) return res.status(400).json({ error: "organizationId, name, subject required" });
    const [row] = await db.insert(educationClasses).values({ organizationId, name, subject, teacherId, room, schedule, maxCapacity }).returning();
    res.status(201).json(row);
  } catch (err) { req.log.error({ err }, "Failed to create class"); res.status(500).json({ error: "Internal server error" }); }
});

router.get("/classes/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(educationClasses).where(eq(educationClasses.id, Number(req.params.id)));
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) { req.log.error({ err }, "Failed to get class"); res.status(500).json({ error: "Internal server error" }); }
});

router.patch("/classes/:id", async (req, res) => {
  try {
    const [row] = await db.update(educationClasses).set(req.body).where(eq(educationClasses.id, Number(req.params.id))).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) { req.log.error({ err }, "Failed to update class"); res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/classes/:id", async (req, res) => {
  try {
    await db.delete(educationClasses).where(eq(educationClasses.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) { req.log.error({ err }, "Failed to delete class"); res.status(500).json({ error: "Internal server error" }); }
});

// ── Enrollments ──
router.get("/enrollments", async (req, res) => {
  try {
    const classId = Number(req.query.classId);
    let query = db.select().from(educationEnrollments);
    if (classId) query = query.where(eq(educationEnrollments.classId, classId)) as typeof query;
    const rows = await query.orderBy(educationEnrollments.enrollmentDate);
    res.json(rows);
  } catch (err) { req.log.error({ err }, "Failed to list enrollments"); res.status(500).json({ error: "Internal server error" }); }
});

router.post("/enrollments", async (req, res) => {
  try {
    const { studentId, classId } = req.body;
    if (!studentId || !classId) return res.status(400).json({ error: "studentId and classId required" });
    const [row] = await db.insert(educationEnrollments).values({ studentId, classId }).returning();
    res.status(201).json(row);
  } catch (err) { req.log.error({ err }, "Failed to create enrollment"); res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/enrollments/:id", async (req, res) => {
  try {
    await db.delete(educationEnrollments).where(eq(educationEnrollments.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) { req.log.error({ err }, "Failed to delete enrollment"); res.status(500).json({ error: "Internal server error" }); }
});

// ── Attendance ──
router.get("/attendance", async (req, res) => {
  try {
    const classId = Number(req.query.classId);
    const date = req.query.date as string;
    let conditions = [];
    if (classId) conditions.push(eq(educationAttendance.classId, classId));
    if (date) conditions.push(eq(educationAttendance.date, date));
    let query = db.select().from(educationAttendance);
    if (conditions.length > 0) query = query.where(and(...conditions)) as typeof query;
    const rows = await query.orderBy(educationAttendance.date);
    res.json(rows);
  } catch (err) { req.log.error({ err }, "Failed to list attendance"); res.status(500).json({ error: "Internal server error" }); }
});

router.post("/attendance", async (req, res) => {
  try {
    const { studentId, classId, date, status, notes } = req.body;
    if (!studentId || !classId || !date) return res.status(400).json({ error: "studentId, classId, date required" });
    const [row] = await db.insert(educationAttendance).values({ studentId, classId, date, status, notes }).returning();
    res.status(201).json(row);
  } catch (err) { req.log.error({ err }, "Failed to record attendance"); res.status(500).json({ error: "Internal server error" }); }
});

// ── Assignments ──
router.get("/assignments", async (req, res) => {
  try {
    const classId = Number(req.query.classId);
    let query = db.select().from(educationAssignments);
    if (classId) query = query.where(eq(educationAssignments.classId, classId)) as typeof query;
    const rows = await query.orderBy(educationAssignments.dueDate);
    res.json(rows);
  } catch (err) { req.log.error({ err }, "Failed to list assignments"); res.status(500).json({ error: "Internal server error" }); }
});

router.post("/assignments", async (req, res) => {
  try {
    const { classId, title, description, maxScore, dueDate } = req.body;
    if (!classId || !title) return res.status(400).json({ error: "classId and title required" });
    const [row] = await db.insert(educationAssignments).values({ classId, title, description, maxScore, dueDate }).returning();
    res.status(201).json(row);
  } catch (err) { req.log.error({ err }, "Failed to create assignment"); res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/assignments/:id", async (req, res) => {
  try {
    await db.delete(educationAssignments).where(eq(educationAssignments.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) { req.log.error({ err }, "Failed to delete assignment"); res.status(500).json({ error: "Internal server error" }); }
});

// ── Grades ──
router.get("/grades", async (req, res) => {
  try {
    const assignmentId = Number(req.query.assignmentId);
    const studentId = Number(req.query.studentId);
    let conditions = [];
    if (assignmentId) conditions.push(eq(educationGrades.assignmentId, assignmentId));
    if (studentId) conditions.push(eq(educationGrades.studentId, studentId));
    let query = db.select().from(educationGrades);
    if (conditions.length > 0) query = query.where(and(...conditions)) as typeof query;
    const rows = await query.orderBy(educationGrades.createdAt);
    res.json(rows);
  } catch (err) { req.log.error({ err }, "Failed to list grades"); res.status(500).json({ error: "Internal server error" }); }
});

router.post("/grades", async (req, res) => {
  try {
    const { studentId, assignmentId, score, feedback } = req.body;
    if (!studentId || !assignmentId || score === undefined) return res.status(400).json({ error: "studentId, assignmentId, score required" });
    const [row] = await db.insert(educationGrades).values({ studentId, assignmentId, score, feedback }).returning();
    res.status(201).json(row);
  } catch (err) { req.log.error({ err }, "Failed to create grade"); res.status(500).json({ error: "Internal server error" }); }
});

// ── Dashboard Stats ──
router.get("/stats", async (req, res) => {
  try {
    const orgId = Number(req.query.organizationId);
    if (!orgId) return res.status(400).json({ error: "organizationId required" });
    const [studentCount] = await db.select({ count: count() }).from(educationStudents).where(eq(educationStudents.organizationId, orgId));
    const [teacherCount] = await db.select({ count: count() }).from(educationTeachers).where(eq(educationTeachers.organizationId, orgId));
    const [classCount] = await db.select({ count: count() }).from(educationClasses).where(eq(educationClasses.organizationId, orgId));
    const [enrollmentCount] = await db.select({ count: count() }).from(educationEnrollments)
      .innerJoin(educationStudents, eq(educationEnrollments.studentId, educationStudents.id))
      .where(eq(educationStudents.organizationId, orgId));
    res.json({
      totalStudents: Number(studentCount?.count ?? 0),
      totalTeachers: Number(teacherCount?.count ?? 0),
      totalClasses: Number(classCount?.count ?? 0),
      totalEnrollments: Number(enrollmentCount?.count ?? 0),
    });
  } catch (err) { req.log.error({ err }, "Failed to get education stats"); res.status(500).json({ error: "Internal server error" }); }
});

export default router;
