import 'dotenv/config';
import { MandatoryString, OptionalBool } from '../lib/env.js';

export const DATABASE_URL = MandatoryString('DATABASE_URL');
export const DISABLE_LOGGING = OptionalBool('DISABLE_LOGGING');