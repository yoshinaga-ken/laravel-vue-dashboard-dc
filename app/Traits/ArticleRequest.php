<?php

namespace App\Traits;

trait ArticleRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|max:50',
            'body' => 'required|max:500',
            'tags' => 'array|max:5',
            'tags.*' => 'regex:/^[^\/=\'";\s]+$/u',
        ];
    }
}
