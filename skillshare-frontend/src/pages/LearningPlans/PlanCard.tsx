import { CreateLearningPlanRequest, LearningPlanSummary } from "../../types/learing-plan-types";
import { Trash2, Edit, Calendar, Book, ListChecks, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { learningPlanApi } from "../../api/learningPlanApi";

interface PlanCardProps {
  plan: LearningPlanSummary;
  currentUser: string;
  handleDelete: (planId: string) => Promise<void>;
  setSelectedPlan: (planId: string) => void;
  setIsUpdateModalOpen: (isOpen: boolean) => void;
  onRefresh: () => Promise<void>;
}

const PlanCard = ({
  currentUser,
  plan,
  handleDelete,
  setSelectedPlan,
  setIsUpdateModalOpen,onRefresh
}: PlanCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const clonePlan = async () => {
    const userConfirmed = window.confirm("Are you sure you want to clone this plan?");
    
    if (!userConfirmed) {
      return; 
    }
  
    try {
      const { id, ...planWithoutId } = plan;
      console.log(id);
      console.dir(planWithoutId);
      const newPlan:CreateLearningPlanRequest = {
        title: plan.title,
        topics: plan.topics,
        resources: plan.resources,
        timeline: plan.timeline,
      }
    //console.dir(planWithoutId);
      await learningPlanApi.createLearningPlan(currentUser, newPlan);
      await onRefresh();
      console.log("Plan cloned successfully.");
    } catch (error) {
      console.error("Error cloning plan:", error);
    }
  };
  

  return (
    <div
      key={plan.id}
      className="bg-white p-6 rounded-xl shadow-md border border-purple-100 hover:shadow-lg transition-all"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold">{plan.title}</h3>
        <button 
          onClick={() => setShowDetails(!showDetails)} 
          className="text-purple-600 hover:text-purple-800"
        >
          {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="flex items-center mb-4">
        <img
          src={plan.owner.profileImageUrl || "/default-avatar.png"}
          alt={`${plan.owner.firstName} ${plan.owner.lastName}`}
          className="w-8 h-8 rounded-full mr-2"
        />
        <span className="text-sm text-gray-600">
          {plan.owner.firstName} {plan.owner.lastName}
        </span>
        <span className="text-xs text-gray-500 ml-4">
          Updated: {formatDate(plan.updatedAt)}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-2 text-gray-600">
        <ListChecks className="w-4 h-4" />
        <p>Topics: {plan.topicCount}</p>
      </div>
      
      {showDetails && (
        <div className="mt-4 space-y-4">
          {/* Topics Section */}
          <div>
            <h4 className="font-medium text-gray-700 flex items-center gap-2 mb-2">
              <ListChecks className="w-4 h-4" /> Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {plan.topics?.map((topic, index) => (
                <span 
                  key={index} 
                  className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
          
          {/* Resources Section */}
          <div>
            <h4 className="font-medium text-gray-700 flex items-center gap-2 mb-2">
              <Book className="w-4 h-4" /> Resources
            </h4>
            <ul className="list-disc pl-5 text-gray-600 text-sm">
              {plan.resources?.map((resource, index) => (
                <li key={index}>{resource}</li>
              ))}
            </ul>
          </div>
          
          {/* Timeline Section */}
          <div>
            <h4 className="font-medium text-gray-700 flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" /> Timeline
            </h4>
            <div className="space-y-2">
              {plan.timeline?.map((item, index) => (
                <div key={index} className="flex justify-between border-b border-gray-100 pb-1 text-sm">
                  <span className="text-gray-700">{item.topic}</span>
                  <span className="text-gray-500">{formatDate(item.expectedCompletionDate)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 flex justify-end">
        {currentUser === plan.owner.id && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedPlan(plan.id);
                setIsUpdateModalOpen(true);
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDelete(plan.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-end">
        {currentUser !== plan.owner.id && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                clonePlan();
              }}
              className="p-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:bg-blue-50 rounded-[10px] transition-all w-[100px]"
            >
             Cone
            </button>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanCard;