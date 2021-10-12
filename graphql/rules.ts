import {
  simpleEstimator,
  createComplexityRule,
} from 'graphql-query-complexity';
import depthLimit from 'graphql-depth-limit';

export const ComplexityLimitRule = createComplexityRule({
  estimators: [simpleEstimator({ defaultComplexity: 1 })],
  maximumComplexity: 1000,
  onComplete: (complexity: number) =>
    console.log(`Query complexity: ${complexity}`),
});

export const DepthLimitRule = depthLimit(4, { ignore: [] });
