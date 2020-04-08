"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as low from 'lowdb';
var low = require("lowdb");
var FileAsync = require("lowdb/adapters/FileAsync");
var DbController = /** @class */ (function () {
    function DbController() {
    }
    /**
     * Initialize Database
     */
    DbController.prototype.init = function (filePath) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var adapter = new FileAsync(filePath);
            low(adapter).then(function (db) {
                _this.db = db;
                _this.db
                    .defaults({
                    controlDef: [],
                    loggingGads: [],
                    log: []
                })
                    .write();
                resolve(_this.db.getState());
            });
        });
    };
    /**
     * Main Log Feature
     * -> Logs all write groupSocketMessages which are stored in loggingGads
     */
    DbController.prototype.log = function (msg) {
        var loggingGads = this.getLoggingGads();
        if (loggingGads.some(function (gad) { return msg.dest === gad; }) && msg.action !== 'read') {
            return this.db.get('log')
                .push(msg)
                .last()
                .write();
        }
        else {
            return Promise.resolve();
        }
    };
    DbController.prototype.getLogs = function (loFilter) {
        return this.db.get('log')
            .filter(loFilter)
            .value();
    };
    /**
     * Logging
     */
    DbController.prototype.getLoggingGads = function () {
        return this.db.get('loggingGads').value();
    };
    DbController.prototype.addLoggingGad = function (gad) {
        return this.db.get('loggingGads')
            .push(gad)
            .last()
            .write();
    };
    DbController.prototype.removeLoggingGad = function (gad) {
        return this.db.get('loggingGads')
            .remove(function (existingGad) { return existingGad === gad; })
            .write();
    };
    /**
     * Control Definitions
     */
    DbController.prototype.getControlDefs = function () {
        return this.db.get('controlDef').value();
    };
    DbController.prototype.setControlDef = function (body) {
        var repo = this.db.get('controlDef');
        var entity = repo.find({ gad: body.gad }).value();
        if (entity) {
            return repo
                .find({ gad: entity.gad })
                .assign(body)
                .write();
        }
        else {
            return repo
                .push(body)
                .last()
                .write();
        }
    };
    DbController.prototype.deleteControlDef = function (body) {
        return this.db.get('controlDef')
            .remove({ gad: body.gad })
            .write();
    };
    return DbController;
}());
exports.DbController = DbController;
