export interface GroupSocketMessage {
    datetime: Date;
    action: string;
    src: string;
    dest: string;
    val: any
    type: string;
}
