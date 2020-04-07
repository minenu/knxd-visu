"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eibd_1 = require("eibd");
var rxjs_1 = require("rxjs");
var chalk_1 = require("chalk");
var EibdController = /** @class */ (function () {
    function EibdController(socketPath) {
        var _this = this;
        this.opts = { host: '--socket', path: socketPath };
        /// Create SocketMessage Observable
        this.socketsMessage$ = new rxjs_1.Observable(function (observer) {
            _this.socketObserver = observer;
        });
    }
    /**
     * Main Listener FN
     */
    EibdController.prototype.listen = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.initKnxd().then(function (knxdAlive) {
                if (!knxdAlive) {
                    console.log(chalk_1.red("KNXD service is not alive!"));
                    resolve();
                    return;
                }
                _this.groupSocketListen(function (err, parser) {
                    if (err) {
                        console.log(chalk_1.red('GroupSocketListen Error', err));
                    }
                    console.log(chalk_1.yellow('GroupSocketListener started'));
                    parser.on('write', function (src, dest, type, val) {
                        var msg = {
                            action: 'write',
                            datetime: new Date(),
                            src: src, dest: dest, type: type, val: val
                        };
                        _this.emitSocketObserver(msg);
                    });
                    parser.on('response', function (src, dest, type, val) {
                        var msg = {
                            action: 'response',
                            datetime: new Date(),
                            src: src, dest: dest, type: type, val: val
                        };
                        _this.emitSocketObserver(msg);
                    });
                    parser.on('read', function (src, dest) {
                        var msg = {
                            action: 'read',
                            datetime: new Date(),
                            src: src, dest: dest, type: null, val: null
                        };
                        _this.emitSocketObserver(msg);
                    });
                    resolve();
                });
            });
        });
    };
    /**
     * Emits an message to
     */
    EibdController.prototype.emitSocketObserver = function (msg) {
        this.socketObserver.next(msg);
    };
    /**
     * Checks if knxd is running and skips listener
     */
    EibdController.prototype.initKnxd = function () {
        return new Promise(function (resolve, reject) {
            require('find-process')('name', 'knxd').then(function (processList) {
                /// Requery ProcessList to filter by bin
                var knxdProcess = processList.find(function (process) { return process.bin === '/usr/bin/knxd'; });
                resolve(!!knxdProcess);
            });
        });
    };
    /**
     * Start GroupSocketListen
     * Do not use internal conn object
     */
    EibdController.prototype.groupSocketListen = function (callback) {
        var _this = this;
        var conn = eibd_1.Connection();
        conn.socketRemote(this.opts, function (err) {
            if (err) {
                callback(err);
                return;
            }
            conn.openGroupSocket(0, function (parser) {
                callback(undefined, parser);
            });
        });
        conn.on('close', function () {
            //restart...
            setTimeout(function () {
                _this.groupSocketListen(callback);
            }, 100);
        });
    };
    /**
     * Basic GroupRead
     */
    EibdController.prototype.groupRead = function (gad, callback) {
        var conn = eibd_1.Connection();
        conn.socketRemote(this.opts, function (err) {
            if (err) {
                callback(err);
                return;
            }
            var address = eibd_1.str2addr(gad);
            conn.openTGroup(address, 0, function (err) {
                if (err) {
                    callback(err);
                    return;
                }
                var msg = eibd_1.createMessage('read');
                conn.sendAPDU(msg, callback);
            });
        });
    };
    /**
     * groupsend
     * Send a KNX telegram with support for read/write/response messages and DPT1, DPT2, DPT3, DPT5, DPT9 data format
     * Contains functionality from groupread/groupwrite/groupswrite in one cmd line application
     *
     * Arguments: host port gad action dpt value
     * gad = groupnumber (Ex. 1/2/34)
     * action = eibd action (read , write or response)
     * dpt = data point type for write/response (Ex. DPT1, DPT2, DPT3, DPT5, DPT9)
     * value = data value for write/response (Ex. true , 23 , 12.23)
     */
    EibdController.prototype.send = function (args, callback) {
        var conn = eibd_1.Connection();
        conn.socketRemote(this.opts, function (err) {
            if (err) {
                callback(err);
                return;
            }
            var address = eibd_1.str2addr(args.dest);
            conn.openTGroup(address, 0, function (err) {
                if (err) {
                    callback(err);
                    return;
                }
                var msg = eibd_1.createMessage(args.action, args.type, parseFloat(args.val));
                conn.sendAPDU(msg, callback);
            });
        });
    };
    return EibdController;
}());
exports.EibdController = EibdController;
