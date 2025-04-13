export const getLearningProgressByType = async (userId: number, type: string) => {
  const response = await fetch(`/api/progress/${userId}?type=${type}`);
  if (!response.ok) {
    throw new Error('Error fetching learning progress');
  }
  return response.json();
};

export const createLearningProgress = async (userId: number, progressData: any) => {
  const response = await fetch(`/api/progress/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(progressData),
  });
  if (!response.ok) {
    throw new Error('Error creating learning progress');
  }
  return response.json();
};

export async function getUserLearningPlans(userId: number) {
  const res = await fetch(`/api/learning-plans/${userId}`);
  return res.json();
}
