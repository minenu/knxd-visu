import { KnxdServer } from './knxd-server';
import { Command } from 'commander';
import { existsSync, openSync, closeSync } from 'fs';
import * as chalk from 'chalk';

/// Import copies packageJson
const pjson = require('./data/package.json');

/// Validates Input Properties
const validateCommand = (programm: any): Promise<void> => {
    return new Promise((resolve, reject) => {
        /// Validate DB File
        if (!existsSync(programm.database)) {
            closeSync(openSync(programm.database, 'a'));
            console.log(`Empty Database file created: ${chalk.cyanBright(programm.database)}`);
            resolve();
        } else {
            resolve();
        }
    });
}

const programm = new Command();
programm.version(pjson.version)
    .option('-v, --version', 'output the current version')
    .option('-p, --port <number>', 'the webservers port', '8080')
    .option('-s, --socket <type>', 'knxd unis socket', '/run/knx')
    .option('-d, --database <type>', 'path to your database file', `${process.cwd()}/dist/data/db.json`);

/// Parse arguments
programm.parse(process.argv);

/// Create ServerApp
let app;
validateCommand(programm).then(() => {
    app = new KnxdServer({
        database: programm.database,
        port: +programm.port,
        socket: programm.socket
    }).getApp();
})


export { app };