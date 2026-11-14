// The only logging module (architecture: Cross-cutting Concerns, Logging).
// Lines are `[channel] message`, plus an optional data object, written to the console only.
// No logging in sim/, and none in per-step or per-frame paths except behind a development flag.
//
// The level filter comes from setLevel(), which main.ts calls: everything in development
// builds, warn and error in release builds. Node scripts that import core/ never call it and
// get the default, everything. Never read import.meta.env here: it is undefined when Node
// runs scripts/*.ts natively.

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export type LogChannel =
  'loop' | 'app' | 'sim-host' | 'render' | 'audio' | 'input' | 'save' | 'assets' | 'ui';

/** Where lines go: the console by default; tests pass a recording sink. */
export interface LogSink {
  error(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  info(...args: unknown[]): void;
  debug(...args: unknown[]): void;
}

export interface Logger {
  error(channel: LogChannel, message: string, data?: unknown): void;
  warn(channel: LogChannel, message: string, data?: unknown): void;
  info(channel: LogChannel, message: string, data?: unknown): void;
  debug(channel: LogChannel, message: string, data?: unknown): void;
  /**
   * Writes a warning the first time `key` is seen on `channel`; later calls with the same channel
   * and key are dropped. A call the level filter drops does not use the key up.
   */
  warnOnce(channel: LogChannel, key: string, message: string, data?: unknown): void;
  /** Passes `level` and everything more severe. An unknown level is ignored. */
  setLevel(level: LogLevel): void;
}

const SEVERITY: Record<LogLevel, number> = { error: 0, warn: 1, info: 2, debug: 3 };

export function createLogger(sink: LogSink = console): Logger {
  let maxSeverity = SEVERITY.debug;
  const warnedKeys = new Set<string>();

  function write(level: LogLevel, channel: LogChannel, message: string, data: unknown): void {
    if (SEVERITY[level] > maxSeverity) return;
    const line = `[${channel}] ${message}`;
    // Pass data only when given, so the console never prints a stray `undefined`.
    if (data === undefined) sink[level](line);
    else sink[level](line, data);
  }

  return {
    error: (channel, message, data) => {
      write('error', channel, message, data);
    },
    warn: (channel, message, data) => {
      write('warn', channel, message, data);
    },
    info: (channel, message, data) => {
      write('info', channel, message, data);
    },
    debug: (channel, message, data) => {
      write('debug', channel, message, data);
    },
    warnOnce: (channel, key, message, data) => {
      if (SEVERITY.warn > maxSeverity) return;
      const channelKey = `${channel}:${key}`;
      if (warnedKeys.has(channelKey)) return;
      warnedKeys.add(channelKey);
      write('warn', channel, message, data);
    },
    setLevel: (level) => {
      // The type allows only LogLevel, but JavaScript callers (a URL parameter, the console)
      // can pass anything; an undefined severity would turn the filter off.
      if (!Object.hasOwn(SEVERITY, level)) return;
      maxSeverity = SEVERITY[level];
    },
  };
}

export const log: Logger = createLogger();
