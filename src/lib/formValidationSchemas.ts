import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  teachers: z.array(z.string()), //teacher ids
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity name is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade name is required!" }),
  supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  subjects: z.array(z.string()).optional(), // subject ids
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  parentId: z.string().min(1, { message: "Parent Id is required!" }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;

export const assignmentSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  startDate: z.coerce.date({ message: "Start date is required!" }),
  dueDate: z.coerce.date({ message: "Due date is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;

export const parentSchema = z.object({
  id: z.string().optional(), // Optional for creation, required for update
  username: z.string().min(3, { message: "Username must be at least 3 characters long!" }),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z.string().email({ message: "Invalid email address!" }).optional(),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  studentId: z.string().optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
});

export type ParentSchema = z.infer<typeof parentSchema>;

export const lessonSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Lesson name is required!" }),
  teachers: z.array(z.string()).nonempty({ message: "At least one teacher is required!" }),
  classId: z.coerce.number().min(1, { message: "Class selection is required!" }),
  subjectId: z.coerce.number().min(1, { message: "Subject selection is required!" }),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], {
    errorMap: () => ({ message: "Valid day selection is required!" }),
  }),
  startTime: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid start time format!" })
    .transform((datetime) => new Date(datetime)),
  endTime: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid end time format!" })
    .transform((datetime) => new Date(datetime)),
});

export type LessonSchema = z.infer<typeof lessonSchema>;



export const eventSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  classId: z.coerce.number().nullable().optional(),
});

export type EventSchema = z.infer<typeof eventSchema>;
export const announcementSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  date: z.coerce.date({ message: "Date is required!" }),
  classId: z.coerce.number().nullable().optional(),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;
export const resultSchema = z.object({
  id: z.coerce.number().optional(), // The id is optional since it's only required for updating
  score: z.number().min(0, "Score must be a positive number"),  // Example range for score
  studentId: z.string().min(1, { message: "Student is required" }), // Must be selected
  examId: z.coerce.number().optional().nullable(), // Optional because a result can be linked to either an exam or assignment
  assignmentId: z.coerce.number().optional().nullable(), // Optional for the same reason
});

export type ResultSchema = z.infer<typeof resultSchema>;
export const attendanceSchema = z.object({
  studentId: z.string().min(1, "Student is required"), // Ensure `studentId` is a string
  date: z.coerce.date(), // Coerce to Date
  lessons: z.array(
    z.object({
      lessonId: z.coerce.number().min(1, "Lesson is required"), // Coerce `lessonId` to number
      present: z.boolean(), // Ensure `present` is a boolean
    })
  ),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;



export const resourceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  fileUrl: z.string().url().optional(), // URL for the uploaded file on Cloudinary
  classId: z.number().min(1, { message: "Class is required!" }),
});

export type ResourceSchema = z.infer<typeof resourceSchema>;
