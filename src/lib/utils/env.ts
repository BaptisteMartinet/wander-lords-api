export class InvalidEnvVariableType extends Error {
  constructor(variable: string, expectedType: string) {
    super(`Invalid env variable type for "${variable}" expected ${expectedType}`);
  }
}

export function OptionalString(variable: string) {
  const value = process.env[variable];
  return value ?? null;
}

export function MandatoryString(variable: string) {
  const value = OptionalString(variable);
  if (value === null)
    throw new Error(`Missing env variable "${variable}"`);
  return value;
}

export function OptionalNumber(variable: string) {
  const value_ = OptionalString(variable);
  if (value_ === null)
    return null;
  const value = Number(value_);
  if (isNaN(value))
    throw new InvalidEnvVariableType(variable, 'Number');
  return value;
}

export function MandatoryNumber(variable: string) {
  const value = OptionalNumber(variable);
  if (value === null)
    throw new InvalidEnvVariableType(variable, 'Number');
  return value;
}

export function OptionalBool(variable: string) {
  const value = OptionalString(variable);
  if (value === null)
    return null;
  if (value !== 'true' && value !== 'false')
    throw new InvalidEnvVariableType(variable, 'Boolean');
  return value === 'true';
}

export function MandatoryBool(variable: string) {
  const value = OptionalBool(variable);
  if (value === null)
    throw new InvalidEnvVariableType(variable, 'Boolean');
  return value;
}
