const EMOJI_MAP = {
    1: '🥲',
    2: '😕',
    3: '😐',
    4: '😊',
    5: '🤩'
  };
  
  export default function FeedbackList({ feedbacks, onFilter }) {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };
  
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Recent Feedback</h2>
          <select 
            onChange={(e) => onFilter(e.target.value)}
            className="border rounded p-2"
            defaultValue=""
          >
            <option value="">All Ratings</option>
            {[1, 2, 3, 4, 5].map(rating => (
              <option key={rating} value={rating}>
                {EMOJI_MAP[rating]} {rating} Star{rating !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
        
        {feedbacks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No feedback found
          </div>
        ) : (
          <div className="divide-y">
            {feedbacks.map(feedback => (
              <div key={feedback.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{feedback.customer_name}</h3>
                    <p className="text-gray-600 mt-1">{feedback.message}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl">
                      {EMOJI_MAP[feedback.rating]}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      {formatDate(feedback.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  