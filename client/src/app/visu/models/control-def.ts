
export class ControlDef {
    gad: string;
    room: string;
    category: string;
    label: string;
    type: string;

    listenerGads: string[];

    /// Options
    icon: string;
    suffix: string;

    constructor(args: {
        gad: string;
        room?: string;
        category?: string;
        label?: string;
        type: string;
        listenerGads?: string[];
        icon?: string;
        suffix?: string;
    }) {
        this.gad = args.gad;
        this.room = args.room || null;
        this.category = args.category || 'No Category';
        this.label = args.label || 'No Label';
        this.type = args.type;
        this.listenerGads = args.listenerGads || [];
        this.icon = args.icon;
        this.suffix = args.suffix;
    }
}
