// File: types.ts

export interface AttendanceData {
    id?: number;
    date: Date;
    present: boolean;
    studentId: string;
    lessonId: number;
  }
  