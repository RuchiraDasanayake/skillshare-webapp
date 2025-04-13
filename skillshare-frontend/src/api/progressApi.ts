// src/api/progressApi.ts
export const getLearningProgressByType = async (userId: number, type: string) => {
  const response = await fetch(`http://localhost:8080/api/progress/user/${userId}/type/${type}`);
  if (!response.ok) throw new Error('Error fetching learning progress');
  return response.json();
};

export const createLearningProgress = async (userId: number, progressData: any) => {
  const response = await fetch(`http://localhost:8080/api/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...progressData, userId })
  });
  if (!response.ok) throw new Error('Error creating learning progress');
  return response.json();
};

export async function getUserLearningPlans(userId: number) {
  const response = await fetch(`http://localhost:8080/api/progress/user/${userId}`);
  if (!response.ok) throw new Error('Error fetching learning plans');
  return response.json();
}