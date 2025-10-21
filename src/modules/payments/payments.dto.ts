import { z } from 'zod';

export const initiatePaymentSchema = z.object({
  subscriptionId: z.string().min(1, 'Subscription ID is required'),
  method: z.enum(['CREDIT_CARD', 'PIX', 'BOLETO']),
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'REFUNDED', 'CANCELLED']),
  externalId: z.string().optional(),
  externalData: z.any().optional(),
});

export type InitiatePaymentDTO = z.infer<typeof initiatePaymentSchema>;
export type UpdatePaymentStatusDTO = z.infer<typeof updatePaymentStatusSchema>;

