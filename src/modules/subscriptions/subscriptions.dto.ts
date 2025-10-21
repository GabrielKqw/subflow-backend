import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
});

export const cancelSubscriptionSchema = z.object({
  reason: z.string().optional(),
});

export type CreateSubscriptionDTO = z.infer<typeof createSubscriptionSchema>;
export type CancelSubscriptionDTO = z.infer<typeof cancelSubscriptionSchema>;

