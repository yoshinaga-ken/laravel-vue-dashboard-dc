<?php

namespace App\Traits;

trait HasTranslatedAttributes
{
    public function getAttributeLabel(string $attribute): string
    {
        $modelName = strtolower(class_basename($this));
        return __("models.{$modelName}.{$attribute}");
    }

    public function getAttributeLabels(): array
    {
        $labels = [];
        foreach ($this->fillable as $attribute) {
            $labels[$attribute] = $this->getAttributeLabel($attribute);
        }
        return $labels;
    }
}
