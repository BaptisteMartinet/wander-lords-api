import type { IDColumnDefinition } from './types';

import { DataTypes } from 'sequelize';
import { ID } from './fieldTypes';

export const DefaultIDFieldDefinition: IDColumnDefinition = { type: ID, defaultValue: DataTypes.UUIDV4 } as const;
