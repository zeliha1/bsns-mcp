
import { Mastra } from '@mastra/core';
import { businessAgent } from './agents/businessAgent';

export const mastra = new Mastra({
  agents: { businessAgent },
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: parseInt(process.env.PORT || '4111'),
  },
  telemetry: {
    disabled: true, // Storage hatası için telemetry'yi devre dışı bırak
  },
});
