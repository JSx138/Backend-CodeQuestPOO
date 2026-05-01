export const handleError = (msg: string, error: unknown) => {
  const normalizedError = error instanceof Error ? error.message : String(error);
  console.error(msg, error);
  return new Error(`${msg}${normalizedError}`);
};