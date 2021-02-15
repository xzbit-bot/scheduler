export function schedule({
  delay,
  fn,
  onError,
}: {
  delay: number,
  fn: () => Promise<unknown>,
  onError: (err: Error) => any,
}): () => Promise<unknown> {
  const execute = async (): Promise<unknown> => {
    try {
      await fn();

      return setTimeout(() => void execute(), delay);
    } catch (error) {
      return onError(error);
    }
  };

  return (): Promise<unknown> => execute();
}
