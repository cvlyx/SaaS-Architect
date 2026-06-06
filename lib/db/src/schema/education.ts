import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { organizationsTable } from "./organizations";

export const educationStudents = sqliteTable("education_students", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  dateOfBirth: text("date_of_birth"),
  gradeLevel: text("grade_level").notNull().default("Freshman"),
  enrollmentDate: text("enrollment_date").notNull().default(sql`(datetime('now'))`),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const educationTeachers = sqliteTable("education_teachers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  subject: text("subject").notNull(),
  hireDate: text("hire_date").notNull().default(sql`(datetime('now'))`),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const educationClasses = sqliteTable("education_classes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: integer("organization_id").notNull().references(() => organizationsTable.id),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  teacherId: integer("teacher_id").references(() => educationTeachers.id),
  room: text("room"),
  schedule: text("schedule"),
  maxCapacity: integer("max_capacity").default(30),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const educationEnrollments = sqliteTable("education_enrollments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("student_id").notNull().references(() => educationStudents.id),
  classId: integer("class_id").notNull().references(() => educationClasses.id),
  enrollmentDate: text("enrollment_date").notNull().default(sql`(datetime('now'))`),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const educationAttendance = sqliteTable("education_attendance", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("student_id").notNull().references(() => educationStudents.id),
  classId: integer("class_id").notNull().references(() => educationClasses.id),
  date: text("date").notNull(),
  status: text("status").notNull().default("present"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const educationAssignments = sqliteTable("education_assignments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  classId: integer("class_id").notNull().references(() => educationClasses.id),
  title: text("title").notNull(),
  description: text("description"),
  maxScore: real("max_score").default(100),
  dueDate: text("due_date"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const educationGrades = sqliteTable("education_grades", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("student_id").notNull().references(() => educationStudents.id),
  assignmentId: integer("assignment_id").notNull().references(() => educationAssignments.id),
  score: real("score").notNull(),
  feedback: text("feedback"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
