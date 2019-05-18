export interface Engine {
  name: string;
  actions: string[];
  signals: string[];
}

export interface UserEvents {
  onUserJoin(id: string): void;
  onUserLeave(id: string): void;
}

export function hasImplementedUserEvents(obj: any): obj is UserEvents {
  return !!((obj as UserEvents).onUserJoin && (obj as UserEvents).onUserJoin);
}
