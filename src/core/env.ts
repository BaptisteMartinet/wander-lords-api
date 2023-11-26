import 'dotenv/config';
import { MandatoryString } from '../lib/env.js';

export const DATABASE_URL = MandatoryString('DATABASE_URL');
