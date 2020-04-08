"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var http = require("http");
var cors = require("cors");
var chalk = require("chalk");
var eibd_controller_1 = require("./controllers/eibd.controller");
var lowdb_controller_1 = require("./controllers/lowdb.controller");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var KnxdServer = /** @class */ (function () {
    function KnxdServer(options) {
        var _this = this;
        this.options = options;
        this.knx = new eibd_controller_1.EibdController(options.socket);
        this.createApp();
        this.createServer();
        this.initDatabase().then(function () {
            console.log(chalk.green("Database initialized: " + chalk.cyanBright(_this.options.database)));
            _this.knx.listen().then(function () {
                _this.listen();
            });
        });
    }
    KnxdServer.prototype.createApp = function () {
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());
        var wwwRoot = __dirname + "/public";
        console.log("Serving public files: " + chalk.cyanBright(wwwRoot));
        this.app.use(express.static(wwwRoot));
    };
    /**
     * Initializes the low Database
     */
    KnxdServer.prototype.initDatabase = function () {
        this.db = new lowdb_controller_1.DbController();
        return this.db.init(this.options.database);
    };
    KnxdServer.prototype.createServer = function () {
        this.server = http.createServer(this.app);
    };
    /**
     * Start Main Listeners
     */
    KnxdServer.prototype.listen = function () {
        var _this = this;
        this.registerApiEndpoints();
        /// Start HttpServer
        this.server.listen(this.options.port, function () {
            console.log(chalk.green("Running server on port " + _this.options.port));
        });
        /// Start Socket.IO Server
        var io = require('socket.io').listen(this.server, {
            origins: '*:*',
            cookie: false
        });
        /// Socket Subscription
        this.knx.socketsMessage$.subscribe(function (msg) {
            console.log("< msg " + msg.action + "|" + msg.dest + "|" + msg.val);
            _this.db.log(msg);
            io.emit('groupSocketMessage', msg);
        });
        /// Handle Socket IO Connections and Listeners
        rxjs_1.fromEvent(io, 'connection').subscribe(function (socket) {
            console.log(chalk.cyan("Client connected"));
            var subscriptions = [];
            /// Observables
            var disconnect$ = rxjs_1.fromEvent(socket, 'disconnect').pipe(operators_1.first());
            var groupSocketMessage$ = rxjs_1.fromEvent(socket, 'groupSocketMessage').pipe(operators_1.takeUntil(disconnect$));
            var groupRead$ = rxjs_1.fromEvent(socket, 'groupRead').pipe(operators_1.takeUntil(disconnect$));
            /// GroupSocketMessage Request
            subscriptions.push(groupSocketMessage$.subscribe(function (msg) {
                console.log(chalk.cyan("> msg: " + msg.action + "|" + msg.dest + "|" + msg.val));
                _this.knx.send(msg, function () { });
            }));
            /// GroupRead Request
            subscriptions.push(groupRead$.subscribe(function (gad) {
                console.log(chalk.cyan("> groupRead: " + gad));
                _this.knx.groupRead(gad, function () { });
            }));
            /// Close all subscriptions
            disconnect$.subscribe(function () {
                console.log(chalk.yellow("Client disconnected"));
                subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
            });
        });
    };
    KnxdServer.prototype.getApp = function () {
        return this.app;
    };
    /**
     * Register API Endpoints
     */
    KnxdServer.prototype.registerApiEndpoints = function () {
        var _this = this;
        /// ControlDefs
        this.app.get('/api/control-def', function (req, res) {
            res.json(_this.db.getControlDefs());
        });
        this.app.post('/api/control-def', function (req, res) {
            _this.db.setControlDef(req.body).then(function (x) { return res.json(x); });
        });
        this.app.post('/api/control-def/delete', function (req, res) {
            _this.db.deleteControlDef(req.body).then(function (x) { return res.json(x); });
        });
        /// LoggingGads
        this.app.get('/api/logging-gads', function (req, res) {
            res.json(_this.db.getLoggingGads());
        });
        this.app.post('/api/logging-gad/add', function (req, res) {
            _this.db.addLoggingGad(req.body.gad).then(function (x) { return res.json(x); });
        });
        this.app.post('/api/logging-gad/remove', function (req, res) {
            _this.db.removeLoggingGad(req.body.gad).then(function (x) { return res.json(x); });
        });
        /// Query Logs
        this.app.post('/api/logs', function (req, res) {
            res.json(_this.db.getLogs(req.body));
        });
    };
    return KnxdServer;
}());
exports.KnxdServer = KnxdServer;
