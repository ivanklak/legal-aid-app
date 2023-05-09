export default abstract class ApplicationError extends Error {
  public abstract name: string;

  public toJSON(): Record<string, unknown> {
    const keys = Object.keys(this);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unsafeThis = this as Record<string, unknown>;

    const sentryData: Record<string, unknown> = {};

    keys.forEach(key => {
      let keyValue = unsafeThis[key];

      if (keyValue instanceof Error && !(keyValue instanceof ApplicationError)) {
        keyValue = keyValue.toString();
      }

      if (keyValue instanceof ApplicationError) {
        keyValue = keyValue.toJSON();
      }

      sentryData[key] = keyValue;
    });

    return sentryData;
  }
}
