export type CreateLearningPlanRequest = {
    title: string;
    topics: string[];
    resources: string[];
    timeline: TopicTimelineDTO[];
};

export type UpdateLearningPlanRequest = {
    title: string;
    topics: string[];
    resources: string[];
    timeline: TopicTimelineDTO[];
};

export type TopicTimelineDTO = {
    topic: string;
    expectedCompletionDate: string; 
};

export type LearningPlanResponse = {
    id: string;
    title: string;
    topics: string[];
    resources: string[];
    timeline: TopicTimelineDTO[];
    createdAt: string; 
    updatedAt: string; 
};

export type LearningPlanWithUserResponse = {
    id: string;
    title: string;
    topics: string[];
    resources: string[];
    timeline: TopicTimelineDTO[];
    createdAt: string;
    updatedAt: string; 
    owner: PlanOwnerDTO;
};

export type PlanOwnerDTO = {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string | null;
};

export type LearningPlanSummary = {
    id: string;
    title: string;
    topicCount: number;
    updatedAt: string;
    owner: PlanOwnerDTO;
    topics: string[];
    resources: string[];
    timeline: TopicTimelineDTO[];
};