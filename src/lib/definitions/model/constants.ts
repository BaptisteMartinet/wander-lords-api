import type { IDFieldDefinition } from './types';

import { DataTypes } from 'sequelize';
import { ID } from './fieldTypes';

export const DefaultIDFieldDefinition: IDFieldDefinition = { type: ID, defaultValue: DataTypes.UUIDV4 };
