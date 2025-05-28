
import { Mastra } from '@mastra/core';
import { businessAgent } from './agents/businessAgent';

export const mastra = new Mastra({
  agents: { businessAgent },
});
