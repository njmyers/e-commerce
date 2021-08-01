import chalk from 'chalk';
import { createLogger, format, transports } from 'winston';

enum Level {
  error = 'error',
  warn = 'warn',
  info = 'info',
  http = 'http',
  verbose = 'verbose',
  debug = 'debug',
}

interface Info {
  class: string;
  method: string;
  level: Level;
  message: string;
  error?: Error;
}

const colors = {
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.green,
  http: chalk.yellow,
  verbose: chalk.cyan,
  debug: chalk.blue,
};

/**
 * Colorize and return an output string
 *
 * @param info - The winston log object
 */
function print({ level, method, message, error, ...info }: Info) {
  const colorize = colors[level];
  const isVerbose = [Level.debug, Level.verbose].includes(level);

  const entries = Object.entries(info).filter(
    ([key]) => typeof key === 'string'
  );

  const data =
    entries.length > 0
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        `\n${JSON.stringify(Object.fromEntries(entries), null, 2)}`
      : '';

  const location =
    info.class && method && isVerbose
      ? chalk.bold(` ${info.class}:${method}()`)
      : info.class
      ? ` ${chalk.bold(info.class)}`
      : '';

  const firstLine = `${colorize(`[${level}]`)}${location} => ${message}`;
  const secondLine = error
    ? `\n${error.message}\n${String(error.stack)}\n`
    : data
    ? `\n${data}\n`
    : '';

  if (secondLine) {
    return `${firstLine}\n${secondLine}`;
  }

  return firstLine;
}

/** A winston compatible logger */
export const logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'http',
  transports: [new transports.Console()],
  // @ts-expect-error This interface is changed dynamically
  format: format.combine(format.printf(print)),
});
