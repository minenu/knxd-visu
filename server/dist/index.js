"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var knxd_server_1 = require("./knxd-server");
var commander_1 = require("commander");
var fs_1 = require("fs");
var chalk = require("chalk");
/// Import copies packageJson
var pjson = require('./data/package.json');
/// Validates Input Properties
var validateCommand = function (programm) {
    return new Promise(function (resolve, reject) {
        /// Validate DB File
        if (!fs_1.existsSync(programm.database)) {
            fs_1.closeSync(fs_1.openSync(programm.database, 'a'));
            console.log("Empty Database file created: " + chalk.cyanBright(programm.database));
            resolve();
        }
        else {
            resolve();
        }
    });
};
var programm = new commander_1.Command();
programm.version(pjson.version)
    .option('-v, --version', 'output the current version')
    .option('-p, --port <number>', 'the webservers port', '8080')
    .option('-s, --socket <type>', 'knxd unis socket', '/run/knx')
    .option('-d, --database <type>', 'path to your database file', process.cwd() + "/dist/data/db.json");
/// Parse arguments
programm.parse(process.argv);
/// Create ServerApp
var app;
exports.app = app;
validateCommand(programm).then(function () {
    exports.app = app = new knxd_server_1.KnxdServer({
        database: programm.database,
        port: +programm.port,
        socket: programm.socket
    }).getApp();
});
