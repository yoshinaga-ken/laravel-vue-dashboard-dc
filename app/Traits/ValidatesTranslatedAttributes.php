<?php

namespace App\Traits;

trait ValidatesTranslatedAttributes
{
    public function attributes(): array
    {
        $model = strtolower(class_basename($this->model()));
        $attributes = [];

        foreach ($this->rules() as $field => $rule) {
            $attributes[$field] = __("models.{$model}.{$field}");
        }

        return $attributes;
    }

    /**
     * 関連するモデルのクラス名を返す
     */
    abstract protected function model(): string;
}
