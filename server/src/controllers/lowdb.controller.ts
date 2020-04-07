// import * as low from 'lowdb';
import * as low from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import { GroupSocketMessage, ControlDef } from '../models';

export class DbController {
    private db: low.Database;

    constructor() {}

    /**
     * Initialize Database
     */
    init(filePath: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const adapter = new FileAsync(filePath);
            low(adapter).then(db => {
                this.db = db;

                this.db
                    .defaults({
                        controlDef: [],
                        loggingGads: [],
                        log: []
                    })
                    .write();

                resolve(this.db.getState());
            });
        });
    }

    /**
     * Main Log Feature
     * -> Logs all write groupSocketMessages which are stored in loggingGads
     */
    log(msg: GroupSocketMessage): Promise<void> {
        const loggingGads = this.getLoggingGads();
        if (loggingGads.some(gad => msg.dest === gad) && msg.action !== 'read') {
            return this.db.get('log')
                .push(msg)
                .last()
                .write();
        } else {
            return Promise.resolve();
        }
    }

    getLogs(loFilter: any): GroupSocketMessage[] {
        return this.db.get('log')
            .filter(loFilter)
            .value();
    }


    /**
     * Logging
     */
    getLoggingGads(): string[] {
        return this.db.get('loggingGads').value();
    }

    addLoggingGad(gad: string): Promise<string> {
        return this.db.get('loggingGads')
            .push(gad)
            .last()
            .write();
    }

    removeLoggingGad(gad: string): Promise<string> {
        return this.db.get('loggingGads')
            .remove(existingGad => existingGad === gad)
            .write();
    }

    /**
     * Control Definitions
     */
    getControlDefs(): ControlDef[] {
        return this.db.get('controlDef').value();
    }

    setControlDef(body: ControlDef): Promise<ControlDef> {
        const repo = this.db.get('controlDef')
        const entity = repo.find({ gad: body.gad }).value();

        if (entity) {
            return repo
                .find({ gad: entity.gad })
                .assign(body)
                .write();
        } else {
            return repo
                .push(body)
                .last()
                .write();
        }
    }

    deleteControlDef(body: any): Promise<ControlDef[]> {
        return this.db.get('controlDef')
            .remove({ gad: body.gad })
            .write();
    }
}