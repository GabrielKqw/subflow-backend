import { z } from 'zod';

export const createPlanSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  durationDays: z.number().int().positive('Duration must be a positive integer'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  isActive: z.boolean().default(true),
});

export const updatePlanSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive').optional(),
  durationDays: z.number().int().positive('Duration must be a positive integer').optional(),
  features: z.array(z.string()).min(1, 'At least one feature is required').optional(),
  isActive: z.boolean().optional(),
});

export type CreatePlanDTO = z.infer<typeof createPlanSchema>;
export type UpdatePlanDTO = z.infer<typeof updatePlanSchema>;

