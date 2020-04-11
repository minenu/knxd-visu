import { Room } from '../models';

export const DATA_POINT_TYPES: string[] = [
    'DPT1', 'DPT2', 'DPT3', 'DPT5', 'DPT9'
];

export const SOCKET_ACTIONS: string[] = [
    'write', 'read'
];

export const CONTROL_TYPES: string[] = [
    'TOGGLE', 'UP_DOWN', 'VALUE', 'SLIDE'
];

export const CONTROL_DEF_ICONS: string[] = [
    'ac_unit',
    'wb_incandescent',
    'wb_iridescent',
    'wb_sunny',
    'wb_cloudy',
    'settings',
    'send',
    'highlight'
];

export const DEFAULT_ROOMS: Room[] = [
    { 
        name: 'Küche',
        icon: 'kitchen',
        temperatureGad: '2/5/0',
        lightGads: ['0/2/3'],
        jalousieGads: ['1/4/10', '1/4/11'],
        order: 1,
        floor: 'Erdgeschoß'
    },
    { 
        name: 'Esszimmer',
        icon: 'local_dining',
        temperatureGad: '2/5/1',
        lightGads: ['0/0/3'],
        jalousieGads: ['1/4/2', '1/4/3', '1/4/4', '1/4/5'],
        order: 2,
        floor: 'Erdgeschoß'
    },
    {
        name: 'Vorraum',
        icon: 'all_out',
        lightGads: ['0/2/6'],
        order: 4,
        floor: 'Erdgeschoß'
    },
    { 
        name: 'Wohnzimmer',
        icon: 'tv',
        temperatureGad: '2/5/2',
        jalousieGads: ['1/4/8', '1/4/9'],
        order: 3,
        floor: 'Erdgeschoß'
    },
    { 
        name: 'Büro',
        icon: 'home_work',
        lightGads: ['0/2/0'],
        jalousieGads: ['1/4/0', '1/4/1'],
        order: 5,
        floor: 'Erdgeschoß'
    },

    { 
        name: 'KiZi Nord',
        icon: 'person_pin',
        temperatureGad: '2/5/5',
        jalousieGads: ['1/5/12', '1/5/13'],
        order: 10,
        floor: 'Obergeschoß'
    },
    { 
        name: 'KiZi Süd',
        icon: 'person_pin',
        temperatureGad: '2/5/6',
        jalousieGads: ['1/5/8', '1/5/9', '1/5/10', '1/5/11'],
        order: 11,
        floor: 'Obergeschoß'
    },
    { 
        name: 'Bad',
        icon: 'hot_tub',
        temperatureGad: '2/5/4',
        jalousieGads: ['1/5/2', '1/5/3'],
        order: 12,
        floor: 'Obergeschoß'
    },
    { 
        name: 'Schlafzimmer',
        icon: 'king_bed',
        temperatureGad: '2/5/7',
        jalousieGads: ['1/5/4', '1/5/5'],
        order: 13,
        floor: 'Obergeschoß'
    },
    {
        name: 'Gang OG',
        icon: 'double_arrow',
        temperatureGad: '2/5/8',
        jalousieGads: ['1/5/0', '1/5/1', '1/5/6', '1/5/7'],
        order: 14,
        floor: 'Obergeschoß'
    }
];
