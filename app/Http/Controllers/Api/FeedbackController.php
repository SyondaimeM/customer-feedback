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
        $rules = [
            'customer_name' => 'required|string|min:3|max:255',
            'message' => 'required|string|min:5|max:1000',
            'rating' => 'required|integer|between:1,5',
            'created_at' => 'nullable|date',
        ];

        $validator = Validator::make($request->all(), $rules, [
            'customer_name.required' => 'The customer name is required.',
            'customer_name.min' => 'Name should at least be 3 characters.',
            'message.min' => 'Message should at least be 5 characters.',
            'message.required' => 'The feedback message is required.',
            'rating.required' => 'The rating is required.',
            'rating.between' => 'The rating must be between 1 and 5.',
            'created_at.date' => 'The creation date must be a valid date.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $feedback = Feedback::create([
            'customer_name' => $request->customer_name,
            'message' => $request->message,
            'rating' => $request->rating,
            'created_at' => $request->created_at ?? now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Feedback stored successfully!',
            'data' => $feedback
        ], 201);
    }

    public function index(Request $request)
    {
        $feedbacks = Feedback::query()
            ->when($request->has('rating'), function ($query) use ($request) {
                $query->where('rating', $request->query('rating'));
            })
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Feedbacks retrieved successfully',
            'data' => $feedbacks
        ]);
    }
}
