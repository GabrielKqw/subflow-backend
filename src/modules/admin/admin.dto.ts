import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['USER', 'ADMIN']),
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type UpdateUserRoleDTO = z.infer<typeof updateUserRoleSchema>;

