import { Connection, Parser, str2addr, createMessage } from 'eibd';
import { Observable, Observer } from 'rxjs';
import { red, yellow } from 'chalk';
import { GroupSocketMessage } from '../models';
import { timingSafeEqual } from 'crypto';

export class EibdController {
    socketsMessage$: Observable<GroupSocketMessage>;

    private opts: { host: string; path: string; };
    private socketObserver: Observer<GroupSocketMessage>;

    constructor(
        socketPath: string
    ) {
        this.opts = { host: '--socket', path: socketPath };

        /// Create SocketMessage Observable
        this.socketsMessage$ = new Observable<GroupSocketMessage>(observer => {
            this.socketObserver = observer;
        });
    }

    /**
     * Main Listener FN
     */
    listen(): Promise<void> {
        return new Promise((resolve) => {
            this.initKnxd().then(knxdAlive => {
                if (!knxdAlive) {
                    console.log(red(`KNXD service is not alive!`));
                    resolve();
                    return;
                }

                this.groupSocketListen((err: Error, parser: Parser) => {
                    if (err) {
                        console.log(red('GroupSocketListen Error', err));
                    }

                    console.log(yellow('GroupSocketListener started'));

                    parser.on('write', (src, dest, type, val) => {
                        const msg: GroupSocketMessage = {
                            action: 'write',
                            datetime: new Date(),
                            src, dest, type, val
                        };
                        this.emitSocketObserver(msg);
                    });

                    parser.on('response', (src, dest, type, val) => {
                        const msg: GroupSocketMessage = {
                            action: 'response',
                            datetime: new Date(),
                            src, dest, type, val
                        };
                        this.emitSocketObserver(msg);
                    });

                    parser.on('read', (src, dest) => {
                        const msg: GroupSocketMessage = {
                            action: 'read',
                            datetime: new Date(),
                            src, dest, type: null, val: null
                        };
                        this.emitSocketObserver(msg);
                    });

                    resolve();
                });
            });
        });
    }

    /**
     * Emits an message to
     */
    private emitSocketObserver(msg: GroupSocketMessage): void {
        this.socketObserver.next(msg);
    }

    /**
     * Checks if knxd is running and skips listener
     */
    private initKnxd(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            require('find-process')('name', 'knxd').then((processList: any[]) => {
                /// Requery ProcessList to filter by bin
                const knxdProcess = processList.find(process => process.bin === '/usr/bin/knxd');
                resolve(!!knxdProcess);
            })
        });
    }

    /**
     * Start GroupSocketListen
     * Do not use internal conn object
     */
    private groupSocketListen(callback) {
        var conn = Connection();
        conn.socketRemote(this.opts, (err) => {
            if (err) {
                callback(err);
                return;
            }

            conn.openGroupSocket(0, (parser) => {
                callback(undefined, parser);
            });
        });

        conn.on('close', () => {
            //restart...
            setTimeout(() => {
                this.groupSocketListen(callback)
            }, 100);
        });
    }

    /**
     * Basic GroupRead
     */
    groupRead(gad, callback) {
        var conn = Connection();
        conn.socketRemote(this.opts, (err) => {
            if (err) {
                callback(err);
                return;
            }

            const address = str2addr(gad);
            conn.openTGroup(address, 0, (err) => {
                if (err) {
                    callback(err);
                    return;
                }
                var msg = createMessage('read');
                conn.sendAPDU(msg, callback);
            });
        });
    }

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
    send(args: GroupSocketMessage, callback) {
        const conn = Connection();
        conn.socketRemote(this.opts, (err) => {
            if (err) {
                callback(err);
                return;
            }

            const address = str2addr(args.dest);
            conn.openTGroup(address, 0, (err) => {
                if (err) {
                    callback(err);
                    return;
                }

                const msg = createMessage(args.action, args.type, parseFloat(args.val));
                conn.sendAPDU(msg, callback);
            });
        });
    }

    /**
     * groupswrite
     * send a group write telegram to a group address (upto DPT3 values)
     *
    groupsWrite(opts, gad, value, callback) {
	    const address = str2addr(gad);
	    this.conn.socketRemote(opts, (err: Error) => {
		    if (err) {
			    callback(err);
			    return;
		    }
		    this.conn.openTGroup(address, 1, (err: Error) => {
			    if (err) {
				    callback(err);
				    return;
			    }
			    const msg = createMessage('write', 'DPT3', parseInt(value));
			    this.conn.sendAPDU(msg, callback);
		    });
	    });
    }
    */

    /**
     * groupwrite
     * send a group write telegram to a group address (for DPT5 values)
     *
    groupWrite(opts, gad, value, callback) {
	    const address = str2addr(gad);
	    this.conn.socketRemote(opts, (err: Error) => {
		    if (err) {
			    callback(err);
			    return;
		    }
		    this.conn.openTGroup(address, 1, (err: Error) => {
			    if (err) {
				    callback(err);
				    return;
			    }
			    const msg = createMessage('write', 'DPT5', parseInt(value));
			    this.conn.sendAPDU(msg, callback);
		    });
	    });
    }
    */
}
