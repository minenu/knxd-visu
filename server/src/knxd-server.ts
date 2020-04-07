import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import * as chalk from 'chalk';
import { EibdController } from './controllers/eibd.controller';
import { DbController } from './controllers/lowdb.controller';
import { fromEvent, Subscription } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { Socket } from 'socket.io';
import { GroupSocketMessage } from './models';

export class KnxdServer {
    private app: express.Application;
    private server: http.Server;
    private db: DbController;
    private knx: EibdController;

    constructor(
        private options: {
            database: string,
            port: number,
            socket: string
        }
    ) {
        this.knx = new EibdController(options.socket);

        this.createApp();
        this.createServer();
        this.initDatabase().then(() => {
            console.log(chalk.green(`Database initialized: ${chalk.cyanBright(this.options.database)}`));
            this.knx.listen().then(() => {
                this.listen();
            })
        });
    }

    private createApp(): void {
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());

        const wwwRoot = `${__dirname}/public`;
        console.log(`Serving public files: ${chalk.cyanBright(wwwRoot)}`);
        this.app.use(express.static(wwwRoot));
    }

    /**
     * Initializes the low Database
     */
    private initDatabase(): Promise<any> {
        this.db = new DbController();
        return this.db.init(this.options.database);
    }

    private createServer(): void {
        this.server = http.createServer(this.app);
    }

    /**
     * Start Main Listeners
     */
    private listen(): void {
        this.registerApiEndpoints();

        /// Start HttpServer
        this.server.listen(this.options.port, () => {
            console.log(chalk.green(`Running server on port ${this.options.port}`));
        });

        /// Start Socket.IO Server
        const io = require('socket.io').listen(this.server, {
            origins: '*:*',
            cookie: false
        });

        /// Socket Subscription
        this.knx.socketsMessage$.subscribe((msg: GroupSocketMessage) => {
            console.log(`< msg ${msg.action}|${msg.dest}|${msg.val}`);
            this.db.log(msg);
            io.emit('groupSocketMessage', msg);
        });

        /// Handle Socket IO Connections and Listeners
        fromEvent(io, 'connection').subscribe((socket: Socket) => {
            console.log(chalk.cyan(`Client connected`));
            const subscriptions: Subscription[] = [];

            /// Observables
            const disconnect$ = fromEvent(socket, 'disconnect').pipe(first());

            const groupSocketMessage$ = fromEvent(socket, 'groupSocketMessage').pipe(takeUntil(disconnect$));
            const groupRead$ = fromEvent(socket, 'groupRead').pipe(takeUntil(disconnect$));

            /// GroupSocketMessage Request
            subscriptions.push(
                groupSocketMessage$.subscribe((msg: GroupSocketMessage) => {
                    console.log(chalk.cyan(`> msg: ${msg.action}|${msg.dest}|${msg.val}`));
                    this.knx.send(msg, () => {});
                })
            );

            /// GroupRead Request
            subscriptions.push(
                groupRead$.subscribe(gad => {
                    console.log(chalk.cyan(`> groupRead: ${gad}`));
                    this.knx.groupRead(gad, () => {});
                })
            );

            /// Close all subscriptions
            disconnect$.subscribe(() => {
                console.log(chalk.yellow(`Client disconnected`));
                subscriptions.forEach(sub => sub.unsubscribe());
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }


    /**
     * Register API Endpoints
     */
    private registerApiEndpoints(): void {
        /// ControlDefs
        this.app.get('/api/control-def', (req: express.Request, res: express.Response) => {
            res.json(this.db.getControlDefs());
        });

        this.app.post('/api/control-def', (req: express.Request, res: express.Response) => {
            this.db.setControlDef(req.body).then(x => res.json(x));
        });

        this.app.post('/api/control-def/delete', (req: express.Request, res: express.Response) => {
            this.db.deleteControlDef(req.body).then(x => res.json(x));
        });

        /// LoggingGads
        this.app.get('/api/logging-gads', (req: express.Request, res: express.Response) => {
            res.json(this.db.getLoggingGads());
        });

        this.app.post('/api/logging-gad/add', (req: express.Request, res: express.Response) => {
            this.db.addLoggingGad(req.body.gad).then(x => res.json(x));
        });

        this.app.post('/api/logging-gad/remove', (req: express.Request, res: express.Response) => {
            this.db.removeLoggingGad(req.body.gad).then(x => res.json(x));
        });

        /// Query Logs
        this.app.post('/api/logs', (req: express.Request, res: express.Response) => {
            res.json(this.db.getLogs(req.body));
        });
    }
}
