import { describe, expect, it } from 'vitest';
import { createLogger } from './log.ts';
import type { LogLevel, LogSink } from './log.ts';

interface Call {
  method: LogLevel;
  args: unknown[];
}

function fakeSink(): { sink: LogSink; calls: Call[] } {
  const calls: Call[] = [];
  const record =
    (method: LogLevel) =>
    (...args: unknown[]): void => {
      calls.push({ method, args });
    };
  return {
    sink: {
      error: record('error'),
      warn: record('warn'),
      info: record('info'),
      debug: record('debug'),
    },
    calls,
  };
}

describe('createLogger', () => {
  it('writes "[channel] message" with no data argument when none is given', () => {
    const { sink, calls } = fakeSink();
    createLogger(sink).info('assets', 'Level loaded');
    expect(calls).toEqual([{ method: 'info', args: ['[assets] Level loaded'] }]);
  });

  it('passes the data object through by reference as a second argument', () => {
    const { sink, calls } = fakeSink();
    const data = { level: 'emberwood', ms: 812 };
    createLogger(sink).info('assets', 'Level loaded', data);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.args[0]).toBe('[assets] Level loaded');
    expect(calls[0]?.args[1]).toBe(data);
  });

  it('maps each level to the console method of the same name', () => {
    const { sink, calls } = fakeSink();
    const log = createLogger(sink);
    log.error('loop', 'e');
    log.warn('audio', 'w');
    log.info('app', 'i');
    log.debug('render', 'd');
    expect(calls.map((c) => c.method)).toEqual(['error', 'warn', 'info', 'debug']);
    expect(calls.map((c) => c.args[0])).toEqual(['[loop] e', '[audio] w', '[app] i', '[render] d']);
  });

  it('passes every level by default, so Node scripts that never set a level see everything', () => {
    const { sink, calls } = fakeSink();
    const log = createLogger(sink);
    log.error('save', 'e');
    log.warn('save', 'w');
    log.info('save', 'i');
    log.debug('save', 'd');
    expect(calls).toHaveLength(4);
  });

  it('drops info and debug and keeps warn and error after setLevel("warn")', () => {
    const { sink, calls } = fakeSink();
    const log = createLogger(sink);
    log.setLevel('warn');
    log.error('ui', 'e');
    log.warn('ui', 'w');
    log.info('ui', 'i');
    log.debug('ui', 'd');
    expect(calls.map((c) => c.method)).toEqual(['error', 'warn']);
  });

  it('passes only error after setLevel("error"), and everything again after setLevel("debug")', () => {
    const { sink, calls } = fakeSink();
    const log = createLogger(sink);
    log.setLevel('error');
    log.warn('input', 'dropped');
    log.error('input', 'kept');
    log.setLevel('debug');
    log.debug('input', 'kept too');
    expect(calls.map((c) => c.args[0])).toEqual(['[input] kept', '[input] kept too']);
  });

  it('writes a warnOnce key only once per logger', () => {
    const { sink, calls } = fakeSink();
    const log = createLogger(sink);
    log.warnOnce('input', 'gamepad-off', 'Gamepad access refused; keyboard only');
    log.warnOnce('input', 'gamepad-off', 'Gamepad access refused; keyboard only');
    expect(calls).toEqual([
      { method: 'warn', args: ['[input] Gamepad access refused; keyboard only'] },
    ]);
  });

  it('writes two different warnOnce keys separately, with their data', () => {
    const { sink, calls } = fakeSink();
    const log = createLogger(sink);
    const err = new Error('refused');
    log.warnOnce('input', 'gamepad-off', 'Gamepad off', err);
    log.warnOnce('audio', 'audio-off', 'Audio off');
    expect(calls).toHaveLength(2);
    expect(calls[0]?.args).toEqual(['[input] Gamepad off', err]);
    expect(calls[1]?.args).toEqual(['[audio] Audio off']);
  });

  it('does not use up a warnOnce key while the level filter drops warnings', () => {
    const { sink, calls } = fakeSink();
    const log = createLogger(sink);
    log.setLevel('error');
    log.warnOnce('assets', 'missing-sfx', 'Sound missing');
    log.setLevel('debug');
    log.warnOnce('assets', 'missing-sfx', 'Sound missing');
    expect(calls).toEqual([{ method: 'warn', args: ['[assets] Sound missing'] }]);
  });

  it('keeps warnOnce keys separate per channel', () => {
    const { sink, calls } = fakeSink();
    const log = createLogger(sink);
    log.warnOnce('audio', 'off', 'Audio off');
    log.warnOnce('input', 'off', 'Gamepad off');
    expect(calls.map((c) => c.args[0])).toEqual(['[audio] Audio off', '[input] Gamepad off']);
  });

  it('ignores an unknown level from a JavaScript caller and keeps the current filter', () => {
    const { sink, calls } = fakeSink();
    const log = createLogger(sink);
    log.setLevel('warn');
    // Simulates an untyped caller, such as a URL parameter passed straight through.
    log.setLevel('verbose' as LogLevel);
    log.info('ui', 'dropped');
    log.warn('ui', 'kept');
    expect(calls.map((c) => c.args[0])).toEqual(['[ui] kept']);
  });
});
