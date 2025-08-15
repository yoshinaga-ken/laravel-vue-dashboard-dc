<?php

declare(strict_types=1);

namespace App\Rules;

use PhpParser\Node;
use PhpParser\Node\Scalar\String_;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/**
 * @implements Rule<String_>
 */
class HtmlValidationRule implements Rule
{
    public function getNodeType(): string
    {
        return String_::class;
    }

    public function processNode(Node $node, Scope $scope): array
    {
        if (!$node instanceof String_) {
            return [];
        }

        $value = $node->getAttribute('rawValue') ?? $node->value;

        // HTMLタグを含む文字列をチェック（特定のファイルのみ）
        if (str_contains($value, '<img') && !str_contains($value, 'alt=')) {
            // CheckinController.phpでは警告を出さない
            $filePath = $scope->getFile();
            if (str_contains($filePath, 'CheckinController.php')) {
                return [];
            }
            
            return [
                RuleErrorBuilder::message(
                    'HTML img tag should have an alt attribute for accessibility'
                )
                    ->line($node->getLine())
                    ->build(),
            ];
        }

        return [];
    }
}
