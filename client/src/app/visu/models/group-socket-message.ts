export class GroupSocketMessage {
    action: string;
    src: string;
    dest: string;
    type: string;
    val: any;
    datetime: Date;

    constructor(args: {
        action?: string;
        src?: string;
        dest?: string;
        type?: string;
        val?: any;
        datetime?: Date;
    }) {
        this.action = args.action;
        this.src = args.src;
        this.dest = args.dest;
        this.type = args.type;
        this.val = args.val;
        this.datetime = args.datetime;
    }
}
