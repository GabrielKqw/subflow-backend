import { Request, Response } from 'express';
import { PlansService } from './plans.service';
import { createPlanSchema, updatePlanSchema } from './plans.dto';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';

export class PlansController {
  private plansService: PlansService;

  constructor() {
    this.plansService = new PlansService();
  }

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    const data = createPlanSchema.parse(req.body);

    const plan = await this.plansService.create(data);

    res.status(201).json({
      message: 'Plan created successfully',
      data: plan,
    });
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    const activeOnly = req.query.activeOnly === 'true';

    const plans = await this.plansService.findAll(activeOnly);

    res.status(200).json({
      message: 'Plans retrieved successfully',
      data: plans,
    });
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const plan = await this.plansService.findById(id);

    res.status(200).json({
      message: 'Plan retrieved successfully',
      data: plan,
    });
  };

  update = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = updatePlanSchema.parse(req.body);

    const plan = await this.plansService.update(id, data);

    res.status(200).json({
      message: 'Plan updated successfully',
      data: plan,
    });
  };

  delete = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    await this.plansService.delete(id);

    res.status(200).json({
      message: 'Plan deleted successfully',
    });
  };

  toggleActive = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const plan = await this.plansService.toggleActive(id);

    res.status(200).json({
      message: 'Plan status updated successfully',
      data: plan,
    });
  };
}

