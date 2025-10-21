import 'dotenv/config';
import 'express-async-errors';
import app from './app';
import { logger } from './shared/config/logger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🌐 API Prefix: ${process.env.API_PREFIX || '/api'}`);
});

