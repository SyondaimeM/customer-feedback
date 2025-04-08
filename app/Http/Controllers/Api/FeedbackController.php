<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Feedback;
use Illuminate\Support\Facades\Validator;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        //Validation rules Added
        $rules = [
            'customer_name' => 'required|string|max:255',      
            'message' => 'required|string|max:1000',             
            'rating' => 'required|integer|between:1,5',          
            'created_at' => 'nullable|date',                     
        ];

        // Custom error messages
        $messages = [
            'customer_name.required' => 'The customer name is required.',
            'message.required' => 'The feedback message is required.',
            'rating.required' => 'The rating is required.',
            'rating.between' => 'The rating must be between 1 and 5.',
            'created_at.date' => 'The creation date must be a valid date.',
        ];

        // Validate the request data
        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422); // Return validation errors with a 422 Unprocessable Entity status
        }

        // If validation passes, store the feedback
        $feedback = Feedback::create([
            'customer_name' => $request->customer_name,
            'message' => $request->message,
            'rating' => $request->rating,
            'created_at' => $request->created_at ?? now(),
        ]);

        return response()->json([
            'message' => 'Feedback stored successfully!',
            'feedback' => $feedback
        ], 201); // Return success response with 201 status
    }

    public function index(Request $request)
    {
        $feedbacks = Feedback::orderBy('created_at', 'desc');

        // Filter by rating if the 'rating' query parameter is provided
        if ($request->has('rating')) {
            $rating = $request->query('rating');
            $feedbacks = $feedbacks->where('rating', $rating);
        }

        // Fetch the 10 most recent feedbacks
        $feedbacks = $feedbacks->limit(10)->get();

        return response()->json([
            'feedback' => $feedbacks
        ], 200);
    }
}
