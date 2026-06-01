const REDACTED_VALUE = '[REDACTED]';
const SENSITIVE_KEYS = new Set([
  'api-key',
  'apikey',
  'authorization',
  'x-api-key',
  'token',
  'access_token',
  'refresh_token',
  'password',
  'secret',
]);
const MAX_REDACTION_DEPTH = 8;

export interface RedactionOptions {
  secrets?: readonly string[];
}

const isSensitiveKey = (key: string): boolean => SENSITIVE_KEYS.has(key.toLowerCase());

const redactString = (value: string, secrets: readonly string[]): string => {
  let redacted = value;
  for (const secret of secrets) {
    if (secret.length > 0) {
      redacted = redacted.split(secret).join(REDACTED_VALUE);
    }
  }
  return redacted;
};

export const redactSensitiveData = (value: unknown, options: RedactionOptions = {}): unknown => {
  const secrets = options.secrets ?? [];
  const seen = new WeakSet<object>();

  const redact = (currentValue: unknown, depth: number): unknown => {
    if (typeof currentValue === 'string') {
      return redactString(currentValue, secrets);
    }

    if (
      currentValue === null ||
      typeof currentValue === 'number' ||
      typeof currentValue === 'boolean' ||
      typeof currentValue === 'undefined'
    ) {
      return currentValue;
    }

    if (typeof currentValue !== 'object') {
      return String(currentValue);
    }

    if (depth >= MAX_REDACTION_DEPTH) {
      return '[REDACTED_OBJECT]';
    }

    if (seen.has(currentValue)) {
      return '[Circular]';
    }
    seen.add(currentValue);

    if (currentValue instanceof Error) {
      return sanitizeError(currentValue, options, depth + 1, redact);
    }

    if (Array.isArray(currentValue)) {
      return currentValue.map((item) => redact(item, depth + 1));
    }

    const redactedObject: Record<string, unknown> = {};
    for (const [key, objectValue] of Object.entries(currentValue as Record<string, unknown>)) {
      redactedObject[key] = isSensitiveKey(key) ? REDACTED_VALUE : redact(objectValue, depth + 1);
    }
    return redactedObject;
  };

  return redact(value, 0);
};

export const sanitizeError = (
  error: Error,
  options: RedactionOptions = {},
  depth = 0,
  redact: (value: unknown, depth: number) => unknown = (value) =>
    redactSensitiveData(value, options),
): Error => {
  const sanitizedError = new Error(redactString(error.message, options.secrets ?? []));
  sanitizedError.name = error.name;
  sanitizedError.stack = redactString(error.stack ?? '', options.secrets ?? []);

  for (const [key, value] of Object.entries(error as unknown as Record<string, unknown>)) {
    (sanitizedError as unknown as Record<string, unknown>)[key] = isSensitiveKey(key)
      ? REDACTED_VALUE
      : redact(value, depth + 1);
  }

  return sanitizedError;
};
