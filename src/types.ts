export interface StudentInfo {
  studentId: string;
  name: string;
  department: string;
}

export interface Question {
  id: number;
  type: 'likert' | 'multiple' | 'subjective';
  text: string;
  imageUrl?: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
}
