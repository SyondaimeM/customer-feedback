import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import Feedback from './models/Feedback';

const App = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const { data } = await Feedback.fetchFeedbacks();
            setFeedbacks(data);
            setFilteredFeedbacks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addFeedback = async (newFeedback) => {
        try {
            const { data } = await Feedback.submitFeedback(newFeedback);
            setFeedbacks(prev => [data, ...prev]);
            setFilteredFeedbacks(prev => [data, ...prev]);
            return true;
        } catch (err) {
            if (err.status === 422) {
                throw err; // Let form handle validation errors
            }
            setError(err.message);
            return false;
        }
    };

    const handleFilter = (rating) => {
        setFilteredFeedbacks(
            rating ? feedbacks.filter(fb => fb.rating === Number(rating)) : feedbacks
        );
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <FeedbackForm onSubmit={addFeedback} />
                {loading ? (
                    <div className="text-center py-8">Loading feedbacks...</div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded">
                        {error}
                    </div>
                ) : (
                    <FeedbackList 
                        feedbacks={filteredFeedbacks} 
                        onFilter={handleFilter}
                    />
                )}
            </div>
        </div>
    );
};

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
