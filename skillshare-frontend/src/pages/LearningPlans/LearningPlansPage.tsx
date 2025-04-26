import { useState, useEffect } from 'react';
import { learningPlanApi } from '../../api/learningPlanApi';
import { LearningPlanSummary } from '../../types/learing-plan-types';
import CreateLearningPlanModal from './CreateLearningPlanModal';
import UpdateLearningPlanModal from './UpdateLearningPlanModal';
import { Loader2, Plus, Search } from 'lucide-react';
import PlanCard from './PlanCard';

const LearningPlansPage = () => {
  const [allLearningPlans, setAllLearningPlans] = useState<LearningPlanSummary[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<LearningPlanSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const currentUser = localStorage.getItem('userId');

  useEffect(() => {
    fetchLearningPlans();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, allLearningPlans]);

  const fetchLearningPlans = async () => {
    try {
      const plans = await learningPlanApi.getAllLearningPlans();
      setAllLearningPlans(plans);
      setFilteredPlans(plans);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch learning plans');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredPlans(allLearningPlans);
      return;
    }

    const searchTerm = searchQuery.toLowerCase().trim();
    const filtered = allLearningPlans.filter(plan => 
      plan.title.toLowerCase().includes(searchTerm)
    );
    setFilteredPlans(filtered);
  };

  const handleDelete = async (planId: string) => {
    if (!window.confirm('Are you sure you want to delete this learning plan?')) return;
    
    try {
      await learningPlanApi.deleteLearningPlan(currentUser!, planId);
      fetchLearningPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete learning plan');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Learning Plans
          </h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Plan
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search learning plans..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <PlanCard 
                currentUser={currentUser!}
                key={plan.id}
                plan={plan}
                setSelectedPlan={setSelectedPlan}
                handleDelete={handleDelete}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                onRefresh={fetchLearningPlans}
              />
            ))}
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateLearningPlanModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchLearningPlans();
          }}
        />
      )}

      {isUpdateModalOpen && selectedPlan && (
        <UpdateLearningPlanModal
          planId={selectedPlan}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedPlan(null);
          }}
          onSuccess={() => {
            setIsUpdateModalOpen(false);
            setSelectedPlan(null);
            fetchLearningPlans();
          }}
        />
      )}
    </div>
  );
};

export default LearningPlansPage;