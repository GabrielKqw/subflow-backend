import { Response } from 'express';
import { PaymentsService } from './payments.service';
import { initiatePaymentSchema, updatePaymentStatusSchema } from './payments.dto';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';

export class PaymentsController {
  private paymentsService: PaymentsService;

  constructor() {
    this.paymentsService = new PaymentsService();
  }

  initiatePayment = async (req: AuthRequest, res: Response): Promise<void> => {
    const data = initiatePaymentSchema.parse(req.body);
    const userId = req.user!.userId;

    const payment = await this.paymentsService.initiatePayment(userId, data);

    res.status(201).json({
      message: 'Payment initiated successfully',
      data: payment,
    });
  };

  findMyPayments = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;

    const payments = await this.paymentsService.findByUserId(userId);

    res.status(200).json({
      message: 'Payments retrieved successfully',
      data: payments,
    });
  };

  findById = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user!.role === 'ADMIN' ? undefined : req.user!.userId;

    const payment = await this.paymentsService.findById(id, userId);

    res.status(200).json({
      message: 'Payment retrieved successfully',
      data: payment,
    });
  };

  findAll = async (req: AuthRequest, res: Response): Promise<void> => {
    const status = req.query.status as string | undefined;

    const payments = await this.paymentsService.findAll(status);

    res.status(200).json({
      message: 'Payments retrieved successfully',
      data: payments,
    });
  };

  updateStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = updatePaymentStatusSchema.parse(req.body);

    const payment = await this.paymentsService.updatePaymentStatus(id, data);

    res.status(200).json({
      message: 'Payment status updated successfully',
      data: payment,
    });
  };

  getStats = async (req: AuthRequest, res: Response): Promise<void> => {
    const stats = await this.paymentsService.getPaymentStats();

    res.status(200).json({
      message: 'Payment statistics retrieved successfully',
      data: stats,
    });
  };
}

