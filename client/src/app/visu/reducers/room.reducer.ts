import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, Action, on } from '@ngrx/store';
import { Room } from '../models';
import * as RoomActions from '../actions/room.actions';

export interface State extends EntityState<Room> {}

export const adapter: EntityAdapter<Room> = createEntityAdapter<Room>({
    selectId: (entity: Room) => entity.name,
    sortComparer: (a: Room, b: Room) => a.order - b.order
});

export const initialState = adapter.getInitialState();

const roomReducer = createReducer(
    initialState,
    on(RoomActions.loadSuccess, (state, { rooms }) => adapter.setAll(rooms, state))
);

export function reducer(state: State | undefined, action: Action) {
    return roomReducer(state, action);
}
