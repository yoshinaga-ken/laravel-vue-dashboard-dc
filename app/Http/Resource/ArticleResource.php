<?php

namespace App\Http\Resource;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->getKey(),
            'title' => $this->title,
            'body' => $this->body,
            'created_at' => $this->created_at,
            'is_liked_by' => $this->isLikedBy(),
            'user' => $this->user,
            'tags' => $this->tags,
            'likes' => $this->likes,
        ];
    }
}
