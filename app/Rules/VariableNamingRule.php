<?php

declare(strict_types=1);

namespace App\Rules;

use PhpParser\Node;
use PhpParser\Node\Expr\Variable;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/**
 * @implements Rule<Variable>
 */
class VariableNamingRule implements Rule
{
    public function getNodeType(): string
    {
        return Variable::class;
    }

    public function processNode(Node $node, Scope $scope): array
    {
        if (!is_string($node->name)) {
            return [];
        }

        $variableName = $node->name;

        // スネークケース（アンダースコア区切り）の変数名をチェック
        if (str_contains($variableName, '_')) {
            $suggestedName = $this->convertToCamelCase($variableName);

            return [
                RuleErrorBuilder::message(
                    sprintf(
                        'Variable name "$%s" should be in camelCase format. Consider using "$%s" instead.',
                        $variableName,
                        $suggestedName
                    )
                )
                    ->line($node->getLine())
                    ->build(),
            ];
        }

        return [];
    }

    private function convertToCamelCase(string $snakeCase): string
    {
        $parts = explode('_', $snakeCase);
        $camelCase = $parts[0];

        for ($i = 1; $i < count($parts); $i++) {
            $camelCase .= ucfirst($parts[$i]);
        }

        return $camelCase;
    }
}
