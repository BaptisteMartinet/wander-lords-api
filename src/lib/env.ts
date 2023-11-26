export class InvalidEnvVariableType extends Error {
  constructor(variable: string, expectedType: string) {
    super(`Invalid env variable type for "${variable}" expected ${expectedType}`);
  }
}

export function MandatoryString(variable: string) {
  const value = process.env[variable];
  if (value === undefined)
    throw new Error(`Missing env variable "${variable}"`);
  return value;
}

export function OptionalString(variable: string) {
  const value = process.env[variable];
  return value ?? null;
}

export function OptionalNumber(variable: string) {
  const value_ = process.env[variable];
  if (value_ === undefined)
    return null;
  const value = Number(value_);
  if (isNaN(value))
    throw new InvalidEnvVariableType(variable, 'Number');
  return value;
}

export function OptionalBool(variable: string) {
  const value = process.env[variable];
  if (value === undefined)
    return null;
  if (value !== 'true' && value !== 'false')
    throw new InvalidEnvVariableType(variable, 'Boolean');
  return value === 'true';
}

export function MandatoryNumber(variable: string) {
  const value = Number(MandatoryString(variable));
  if (isNaN(value))
    throw new InvalidEnvVariableType(variable, 'Number');
  return value;
}

export function MandatoryBool(variable: string) {
  const value = MandatoryString(variable);
  if (value !== 'true' && value !== 'false')
    throw new InvalidEnvVariableType(variable, 'Boolean');
  return value === 'true';
}
