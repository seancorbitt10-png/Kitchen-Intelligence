export type OperationalEvent = { name: string; userId?: number; operation?: string; metadata?: Record<string, unknown>; error?: unknown };

const operationBuckets = new Map<string, { startedAt: number; count: number }>();
const OPERATION_WINDOW_MS = 60_000;
const OPERATION_LIMIT = 12;

export function allowUserOperation(userId: number, operation: string) {
  const key = `${userId}:${operation}`;
  const now = Date.now();
  const current = operationBuckets.get(key);
  if (!current || now - current.startedAt >= OPERATION_WINDOW_MS) {
    operationBuckets.set(key, { startedAt: now, count: 1 });
    return true;
  }
  current.count += 1;
  return current.count <= OPERATION_LIMIT;
}

export function resetOperationBucketsForTests() {
  operationBuckets.clear();
}

export function sanitizeError(error: unknown) {
  if (error instanceof Error) return { name: error.name, message: error.message.slice(0, 240) };
  return { name: "UnknownError", message: "Unknown operational error" };
}

export type MonitoringAdapter = { report(event: OperationalEvent): Promise<boolean> };
export const disabledMonitoringAdapter: MonitoringAdapter = { async report() { return false; } };

export type EmailAdapter = { send(input: { to: string; template: string; variables?: Record<string, string> }): Promise<boolean> };
export const disabledEmailAdapter: EmailAdapter = { async send() { return false; } };

export async function reportOperationalEvent(event: OperationalEvent) {
  if (process.env.NODE_ENV !== "test") console.warn("[OperationalEvent]", JSON.stringify({ ...event, error: event.error ? sanitizeError(event.error) : undefined }));
  return disabledMonitoringAdapter.report(event);
}
