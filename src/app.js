import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import { httpLogger } from './utils/logger.js';
import { security, apiLimiter } from './middlewares/security.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

import metricsRoutes from './metrics/metrics.routes.js';

import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/user/user.routes.js';
import serviceRoutes from './modules/service/service.routes.js';
import enquiryRoutes from './modules/enquiry/enquiry.routes.js';
import categoryRoutes from './modules/category/category.routes.js';
import subcategoryRoutes from './modules/subcategory/subcategory.routes.js';
import productRoutes from './modules/product/product.routes.js';
import searchRoutes from './modules/search/search.routes.js';

const app = express();

app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(...security);
app.use(httpLogger);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// rate limit all /api
app.use('/api', apiLimiter);

// metrics & health
app.use('/_system', metricsRoutes);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/search', searchRoutes);

// docs

app.use(notFound);
app.use(errorHandler);

export default app;
