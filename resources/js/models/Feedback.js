class Feedback {
    static async fetchFeedbacks() {
        const response = await fetch('/api/feedback');
        if (!response.ok) {
            throw new Error(`Failed to fetch feedbacks: ${response.status}`);
        }
        return await response.json();
    }

    static async submitFeedback(feedbackData) {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(feedbackData)
        });

        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || 'Validation failed');
            if (response.status === 422) {
                error.errors = data.errors;
            }
            error.status = response.status;
            throw error;
        }

        return data;
    }
}

export default Feedback;
