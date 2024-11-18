"use server";

import { revalidatePath } from "next/cache";
import {
  AnnouncementSchema,
  AssignmentSchema,
  AttendanceSchema,
  ClassSchema,
  EventSchema,
  ExamSchema,
  LessonSchema,
  ParentSchema,
  ResourceSchema,
  ResultSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { uploadFileToCloudinary } from '@/lib/cloudinary';



type CurrentState = { success: boolean; error: boolean };

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.create({
      data,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata:{role:"teacher"}
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// Ensure Clerk is correctly imported

export const createStudent = async (currentState: CurrentState, data: StudentSchema) => {
  console.log(data);
  try {
    // Check if the class is at capacity
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true };
    }

    // Create the user in Clerk and set the password there
    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password, // Password handled only by Clerk
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });

    // Create student record in Prisma without the password
    const student = await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId  
      },
    });

    // Automatically add an attendance record
    await prisma.attendance.create({
      data: {
        studentId: student.id,
        date: new Date(), // Default to the current date; adjust as needed
        present: false, // Adjust the default status as needed
        lessonId: 1, // Assign a default or dynamic lesson ID as required
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    // Update user details in Clerk
    const userUpdates = {
      username: data.username,
      firstName: data.name,
      lastName: data.surname,
      ...(data.password && data.password !== "" && { password: data.password }), // Only update password if it's provided and not empty
    };
    
    await clerkClient.users.updateUser(data.id, userUpdates);

    // Update other student data in Prisma, excluding password
    await prisma.student.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const createAssignment = async (data: AssignmentSchema) => {
  try {
    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const updateAssignment = async (data: AssignmentSchema) => {
  try {
    await prisma.assignment.update({
      where: { id: data.id },
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const deleteAssignment = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string; // Get the ID from FormData

  if (!id) {
    console.error("No ID provided.");
    return { success: false, error: true };
  }

  try {
    const deletedAssignment = await prisma.assignment.delete({
      where: {
        id: parseInt(id, 10), // Ensure we parse the ID as an integer
      },
    });

    // Optionally, revalidate the path if necessary
    // revalidatePath("/list/assignments"); 

    return { success: true, error: false, deletedAssignment };
  } catch (err) {
    console.error("Error deleting assignment:", err);
    return { success: false, error: true };
  }
};

export const createLesson = async (data: LessonSchema) => {
  try {
    const lesson = await prisma.lesson.create({
      data: {
        name: data.name,
        classId: data.classId,
        teacherId: data.teachers[0], // Assuming one teacher is selected for simplicity
        subjectId: data.subjectId,
        day: data.day,
        startTime: new Date(data.startTime), // Ensure this is a Date
        endTime: new Date(data.endTime), // Ensure this is a Date
      },
    });
    return { success: true, lesson };
  } catch (err) {
    console.error("Error creating lesson:", err);
    return { success: false, error: true };
  }
};

export const updateLesson = async (data: LessonSchema) => {
  try {
    await prisma.lesson.update({
      where: { id: data.id },
      data: {
        name: data.name,
        day: data.day,
        startTime: new Date(data.startTime), // Ensure this is a Date
        endTime: new Date(data.endTime), // Ensure this is a Date
        classId: data.classId,
        teacherId: data.teachers[0], // Assuming only one teacher per lesson for simplicity
        subjectId: data.subjectId,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.error("Update Lesson Error:", err);
    return { success: false, error: true };
  }
}; 
export const deleteLesson = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string; // Get the ID from FormData

  if (!id) {
    console.error("No ID provided.");
    return { success: false, error: true };
  }

  try {
    await prisma.lesson.delete({
      where: {
        id: parseInt(id, 10), // Ensure we parse the ID as an integer
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.error("Delete Lesson Error:", err);
    return { success: false, error: true };
  }
};


// Create an event
export const createEvent = async (data: EventSchema) => { 
  try {
    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        classId: data.classId || null,
      },
    });
    return { success: true };
  } catch (err) {
    console.error("Create Event Error:", err);
    return { success: false };
  }
};

// Update an event
export const updateEvent = async (data: EventSchema) => {
  try {
    await prisma.event.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        classId: data.classId || null,
      },
    });
    return { success: true };
  } catch (err) {
    console.error("Update Event Error:", err);
    return { success: false };
  }
};

// Delete an event
export const deleteEvent = async (currentState: CurrentState, data: FormData) => { 
  const id = data.get("id") as string; // Get the ID from FormData

  if (!id) {
    console.error("No ID provided.");
    return { success: false, error: true };
  }

  try {
    await prisma.event.delete({
      where: {
        id: parseInt(id, 10), // Ensure we parse the ID as an integer
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.error("Delete Event Error:", err);
    return { success: false, error: true };
  }
};

export const createAnnouncement = async (data: AnnouncementSchema) => {
  try {
    await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        classId: data.classId || null,
      },
    });
    return { success: true };
  } catch (err) {
    console.error("Create Announcement Error:", err);
    return { success: false };
  }
};

// Update an announcement
export const updateAnnouncement = async (data: AnnouncementSchema) => {
  try {
    await prisma.announcement.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        classId: data.classId || null,
      },
    });
    return { success: true };
  } catch (err) {
    console.error("Update Announcement Error:", err);
    return { success: false };
  }
};
export const deleteAnnouncement = async (currentState: CurrentState, data: FormData) => { 
  const id = data.get("id") as string; // Get the ID from FormData

  if (!id) {
    console.error("No ID provided.");
    return { success: false, error: true };
  }

  try {
    await prisma.announcement.delete({
      where: {
        id: parseInt(id, 10), // Ensure we parse the ID as an integer
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.error("Delete Announcement Error:", err);
    return { success: false, error: true };
  }
};
export const createResult = async (currentState: CurrentState, data: ResultSchema) => {
  try {
    await prisma.result.create({
      data: {
        score: data.score,
        studentId: data.studentId,
        examId: data.examId || null, // Optional because result can be tied to either exam or assignment
        assignmentId: data.assignmentId || null,
      },
    });

    // Optionally revalidate the path after creation
    // revalidatePath("/list/results");

    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating result:", err);
    return { success: false, error: true };
  }
};
export const updateResult = async (currentState: CurrentState, data: ResultSchema) => {
  try {
    await prisma.result.update({
      where: {
        id: data.id,
      },
      data: {
        score: data.score,
        studentId: data.studentId,
        examId: data.examId || null,
        assignmentId: data.assignmentId || null,
      },
    });

    // Optionally revalidate the path after update
    // revalidatePath("/list/results");

    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating result:", err);
    return { success: false, error: true };
  }
};
export const deleteResult = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;

  try {
    await prisma.result.delete({
      where: {
        id: parseInt(id, 10), // Ensure id is parsed as an integer
      },
    });

    // Optionally revalidate the path after deletion
    // revalidatePath("/list/results");

    return { success: true, error: false };
  } catch (err) {
    console.error("Error deleting result:", err);
    return { success: false, error: true };
  }
};




// Function to create a new parent
export const createParent = async (data: ParentSchema) => {
  try {
    // Create a user with Clerk and assign the parent role
    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "parent" },
    });

    // Add the new parent to the Prisma database
    await prisma.parent.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
        students: data.studentId ? { connect: { id: data.studentId } } : undefined,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating parent:", err);
    return { success: false, error: true };
  }
};

// Function to update an existing parent
export const updateParent = async (data: ParentSchema) => {
  if (!data.id) {
    return { success: false, error: true, message: "Parent ID is required." };
  }

  try {
    // Update user in Clerk if any user details change
    await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    // Update parent information in Prisma
    await prisma.parent.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
        students: data.studentId ? { connect: { id: data.studentId } } : undefined,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating parent:", err);
    return { success: false, error: true };
  }
};

// Function to delete an existing parent
export const deleteParent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    // Delete the parent user from Clerk
    await clerkClient.users.deleteUser(id);

    // Delete the parent record from the Prisma database
    await prisma.parent.delete({
      where: {
        id: id,
      },
    });

    // Optionally, revalidate any related paths if needed
    // revalidatePath("/list/parents");

    return { success: true, error: false };
  } catch (err) {
    console.error("Error deleting parent:", err);
    return { success: false, error: true };
  }
};
export const createAttendance = async (data: AttendanceSchema) => {
  try {
    // Prepare the data array for each lesson
    const attendanceData = data.lessons.map((lesson) => ({
      studentId: data.studentId,
      date: data.date,
      lessonId: lesson.lessonId,
      present: lesson.present ?? false,  // Ensure `present` is always a boolean
    }));

    // Use Prisma createMany to insert multiple records
    await prisma.attendance.createMany({ data: attendanceData });
    return { success: true };
  } catch (error) {
    console.error("Create Attendance Error:", error);
    return { success: false };
  }
};
export const updateAttendance = async (data: AttendanceSchema) => {
  try {
    const studentId = data.studentId.toString();

    // Iterate over each lesson to either update or create attendance records
    for (const lesson of data.lessons) {
      // Check if the attendance record already exists
      const existingAttendance = await prisma.attendance.findFirst({
        where: {
          studentId: studentId,
          lessonId: lesson.lessonId,
          date: data.date,
        },
      });

      if (existingAttendance) {
        // Update the existing record
        await prisma.attendance.update({
          where: { id: existingAttendance.id },
          data: { present: lesson.present ?? false },
        });
      } else {
        // Create a new record
        await prisma.attendance.create({
          data: {
            studentId: studentId,
            date: data.date,
            lessonId: lesson.lessonId,
            present: lesson.present ?? false,
          },
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Update Attendance Error:", error);
    return { success: false };
  }
};
// Delete Attendance Function
export const deleteAttendance = async (id: number | string) => {
  try {
    await prisma.attendance.delete({
      where: {
        id: typeof id === "string" ? parseInt(id, 10) : id, // Ensure id is an integer
      },
    });

    // Optionally revalidate the attendance list after deletion
    // revalidatePath("/attendance/list");

    return { success: true, error: false };
  } catch (error) {
    console.error("Error deleting attendance:", error);
    return { success: false, error: true };
  }
};



// Assuming you have a Cloudinary upload function
interface ResourceData {
  title: string;
  description?: string;
  fileUrl?: string;
  classId: number;
}
export const createResource = async (data: ResourceSchema) => {
  try {
    const newResource = await prisma.resource.create({
      data: {
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl ?? '',
        classId: data.classId, // Assuming resources are associated with a class
      },
    });
    return { success: true, resource: newResource };
  } catch (error) {
    console.error("Error creating resource:", error);
    return { success: false };
  }
};

export const updateResource = async (data: ResourceSchema) => {
  if (!data.id) return { success: false, error: "Resource ID is missing" };

  try {
    await prisma.resource.update({
      where: { id: Number(data.id) }, 
      data: {
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        classId: data.classId,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating resource:", error);
    return { success: false };
  }
};
// Delete Resource
export const deleteResource = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string; // Extract ID from FormData

  if (!id) {
    console.error("No ID provided for deleting resource.");
    return { success: false, error: true };
  }

  try {
    await prisma.resource.delete({
      where: { id: parseInt(id, 10) }, // Ensure ID is an integer
    });
    return { success: true, error: false };
  } catch (error) {
    console.error("Error deleting resource:", (error as Error).message);
    return { success: false, error: true }; // Set error as boolean
  }
};