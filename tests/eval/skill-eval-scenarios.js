export * from './scenario-helpers.js';

import { FW_SETUP_SCENARIOS } from './scenarios/fw-setup.js';
import { FW_APP_DEV_SCENARIOS } from './scenarios/fw-app-dev.js';
import { FW_PUBLISH_SCENARIOS } from './scenarios/fw-publish.js';
import { FW_REVIEW_SCENARIOS } from './scenarios/fw-review.js';
import { FW_AI_ACTIONS_SCENARIOS } from './scenarios/fw-ai-actions.js';

export const SCENARIOS = [
  ...FW_SETUP_SCENARIOS,
  ...FW_APP_DEV_SCENARIOS,
  ...FW_PUBLISH_SCENARIOS,
  ...FW_REVIEW_SCENARIOS,
  ...FW_AI_ACTIONS_SCENARIOS,
];
