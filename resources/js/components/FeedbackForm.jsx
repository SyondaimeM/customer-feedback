import { useState } from 'react';

const EMOJI_SCALE = [
    { value: 1, emoji: '🥲', label: 'Very Unhappy' },
    { value: 2, emoji: '😕', label: 'Unhappy' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '😊', label: 'Happy' },
    { value: 5, emoji: '🤩', label: 'Very Happy' }
];

const FeedbackForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        customer_name: '',
        message: '',
        rating: 3
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rating' ? parseInt(value) : value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        
        try {
            const success = await onSubmit(formData);
            if (success) {
                setFormData({
                    customer_name: '',
                    message: '',
                    rating: 3
                });
            }
        } catch (err) {
            if (err.status === 422) {
                setErrors(err.errors || {});
            } else {
                setSubmitError(err.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Submit Feedback</h2>
            
            {submitError && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
                    {submitError}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                        type="text"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded ${
                            errors.customer_name ? 'border-red-500' : ''
                        }`}
                        disabled={isSubmitting}
                    />
                    {errors.customer_name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.customer_name[0]}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Message</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded ${
                            errors.message ? 'border-red-500' : ''
                        }`}
                        rows="4"
                        disabled={isSubmitting}
                    />
                    {errors.message && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.message[0]}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Rating</label>
                    <div className="flex justify-between mt-2">
                        {EMOJI_SCALE.map(({ value, emoji, label }) => (
                            <label 
                                key={value} 
                                className={`flex flex-col items-center p-2 rounded cursor-pointer ${
                                    formData.rating === value ? 'bg-blue-50' : ''
                                } ${isSubmitting ? 'opacity-50' : ''}`}
                            >
                                <span className="text-2xl">{emoji}</span>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={value}
                                    checked={formData.rating === value}
                                    onChange={handleChange}
                                    className="hidden"
                                    disabled={isSubmitting}
                                />
                                <span className="text-xs mt-1">{label}</span>
                            </label>
                        ))}
                    </div>
                    {errors.rating && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.rating[0]}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-blue-500 text-white py-2 px-4 rounded w-full ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                    }`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;
