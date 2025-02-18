<?php

namespace App\Http\Requests;

use App\Models\Article;
use App\Traits\ArticleRequest;
use App\Traits\ValidatesTranslatedAttributes;
use Illuminate\Foundation\Http\FormRequest;

class UpdateArticleRequest extends FormRequest
{
    use ValidatesTranslatedAttributes;
    use ArticleRequest;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function model(): string
    {
        return Article::class;
    }
}
