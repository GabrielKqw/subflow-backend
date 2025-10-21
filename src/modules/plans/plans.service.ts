import { Plan } from '@prisma/client';
import { PlansRepository } from './plans.repository';
import { CreatePlanDTO, UpdatePlanDTO } from './plans.dto';
import { NotFoundError, ConflictError } from '../../shared/errors/AppError';

export class PlansService {
  private plansRepository: PlansRepository;

  constructor() {
    this.plansRepository = new PlansRepository();
  }

  async create(data: CreatePlanDTO): Promise<Plan> {
    const plan = await this.plansRepository.create(data);
    return plan;
  }

  async findAll(activeOnly: boolean = false): Promise<Plan[]> {
    return this.plansRepository.findAll(activeOnly);
  }

  async findById(id: string): Promise<Plan> {
    const plan = await this.plansRepository.findById(id);

    if (!plan) {
      throw new NotFoundError('Plan not found');
    }

    return plan;
  }

  async update(id: string, data: UpdatePlanDTO): Promise<Plan> {
    const planExists = await this.plansRepository.exists(id);

    if (!planExists) {
      throw new NotFoundError('Plan not found');
    }

    const updatedPlan = await this.plansRepository.update(id, data);
    return updatedPlan;
  }

  async delete(id: string): Promise<void> {
    const planExists = await this.plansRepository.exists(id);

    if (!planExists) {
      throw new NotFoundError('Plan not found');
    }

    const activeSubscriptions = await this.plansRepository.countActiveSubscriptions(id);

    if (activeSubscriptions > 0) {
      throw new ConflictError(
        `Cannot delete plan with ${activeSubscriptions} active subscriptions`
      );
    }

    await this.plansRepository.delete(id);
  }

  async toggleActive(id: string): Promise<Plan> {
    const plan = await this.findById(id);

    return this.plansRepository.update(id, {
      isActive: !plan.isActive,
    });
  }
}

