export enum UserPrivilege {
    NORMAL = 0,
    ADMIN = 1
}

export enum ActivityStatus {
    TAKE = 0,
    SHUFFLE = 1,
    LEAVE = 2
}

export interface User {
    id: string;
    name: string;
    email: string;
    privilege: UserPrivilege;
    avatar_url: string;
}

export interface Group {
    id: string;
    name: string;
    users: string[];
}

export interface ToolThumbnail {
    id: string;
    name: string;
    url: string;
}

export interface Tool {
    id: string;
    group: {
        id: string;
    };
    name: string;
    thumbnail_url: string;
    users: string[];
    last_activity: ToolActivity | null;
}

export interface ToolActivity {
    id: string;
    tool: {
        id: string;
    };
    occupied_by: {
        id: string;
    };
    location: {
        lon: string | null;
        lat: string | null;
        name: string | null;
    };
    status: ActivityStatus;
    created_at: string;
}

export interface ToolActivityUpdate {
    occupied_by?: string;
    status: ActivityStatus;
}

export type SelectionToolActivityUpdate = ToolActivityUpdate & {
    toolId: string;
}