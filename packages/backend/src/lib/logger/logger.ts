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
function print({ level, method, message, ...info }: Info) {
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

  return `${colorize(`[${level}]`)}${location} => ${message}${data}`;
}

/** A winston compatible logger */
export const logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'http',
  transports: [new transports.Console()],
  // @ts-expect-error This interface is changed dynamically
  format: format.combine(format.printf(print)),
});
