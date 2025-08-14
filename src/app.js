const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { env } = require('./config/env.js');
const { httpLogger } = require('./utils/logger.js');
const { security, apiLimiter } = require('../src/middlewares/security.js');
const { errorHandler, notFound } = require('./middlewares/errorHandler.js');

const metricsRoutes = require('../src/modules/metrics/metrics.routes.js');

const authRoutes = require('./modules/auth/auth.routes.js');
const userRoutes = require('./modules/user/user.routes.js');
const serviceRoutes = require('./modules/service/service.routes.js');
const enquiryRoutes = require('./modules/enquiry/enquiry.routes.js');
const categoryRoutes = require('./modules/category/category.routes.js');
const subcategoryRoutes = require('./modules/subcategory/subcategory.routes.js');
const productRoutes = require('./modules/product/product.routes.js');
const searchRoutes = require('./modules/search/search.routes.js');


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

module.exports = app;
