import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  planId: z.string().uuid('Invalid plan ID'),
});

export const cancelSubscriptionSchema = z.object({
  reason: z.string().optional(),
});

export type CreateSubscriptionDTO = z.infer<typeof createSubscriptionSchema>;
export type CancelSubscriptionDTO = z.infer<typeof cancelSubscriptionSchema>;

