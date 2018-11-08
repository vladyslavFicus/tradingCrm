const path = require('path');
const fs = require('fs');

/**
 * Check if default .env exist to use for custom environment configuration
 * Else --> use .env.${APP_ENV} file
 */
const customEnvPath = path.resolve(process.cwd(), `.env.${process.env.APP_ENV}`);
const defaultEnvPath = path.resolve(process.cwd(), '.env');

const envPath = fs.existsSync(defaultEnvPath) ? defaultEnvPath : customEnvPath;

require('dotenv').config({ path: envPath });
