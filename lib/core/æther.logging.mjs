import logger from 'oh-my-log';
import chalk from 'chalk';

const log = logger('⚗ ');
    
export class Logging {
    notify = (message) => {
        log(chalk.bgCyan.black(` ${message} `));
    };

    error = (message) => {
        log(chalk.bgRed.white(` ${message} `));
    };
}

export { Logging as default };