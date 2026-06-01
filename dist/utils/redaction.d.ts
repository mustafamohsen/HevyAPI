export interface RedactionOptions {
    secrets?: readonly string[];
}
export declare const redactSensitiveData: (value: unknown, options?: RedactionOptions) => unknown;
export declare const sanitizeError: (error: Error, options?: RedactionOptions, depth?: number, redact?: (value: unknown, depth: number) => unknown) => Error;
//# sourceMappingURL=redaction.d.ts.map