import { Response } from 'express';
import { SubscriptionsService } from './subscriptions.service';
import { createSubscriptionSchema } from './subscriptions.dto';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';

export class SubscriptionsController {
  private subscriptionsService: SubscriptionsService;

  constructor() {
    this.subscriptionsService = new SubscriptionsService();
  }

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    const data = createSubscriptionSchema.parse(req.body);
    const userId = req.user!.userId;

    const subscription = await this.subscriptionsService.create(userId, data);

    res.status(201).json({
      message: 'Subscription created successfully',
      data: subscription,
    });
  };

  findMySubscriptions = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const activeOnly = req.query.activeOnly === 'true';

    const subscriptions = activeOnly
      ? await this.subscriptionsService.findActiveByUserId(userId)
      : await this.subscriptionsService.findByUserId(userId);

    res.status(200).json({
      message: 'Subscriptions retrieved successfully',
      data: subscriptions,
    });
  };

  findById = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user!.role === 'ADMIN' ? undefined : req.user!.userId;

    const subscription = await this.subscriptionsService.findById(id, userId);

    res.status(200).json({
      message: 'Subscription retrieved successfully',
      data: subscription,
    });
  };

  findAll = async (req: AuthRequest, res: Response): Promise<void> => {
    const status = req.query.status as string | undefined;

    const subscriptions = await this.subscriptionsService.findAll(status);

    res.status(200).json({
      message: 'Subscriptions retrieved successfully',
      data: subscriptions,
    });
  };

  cancel = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user!.userId;

    const subscription = await this.subscriptionsService.cancel(id, userId);

    res.status(200).json({
      message: 'Subscription cancelled successfully',
      data: subscription,
    });
  };

  activate = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const subscription = await this.subscriptionsService.activate(id);

    res.status(200).json({
      message: 'Subscription activated successfully',
      data: subscription,
    });
  };

  renew = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const subscription = await this.subscriptionsService.renewSubscription(id);

    res.status(200).json({
      message: 'Subscription renewed successfully',
      data: subscription,
    });
  };
}

