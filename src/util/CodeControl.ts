import { error } from 'console';
import fs from 'fs';
import path from 'path';

interface ICommand {
    type?: number;
    name?: string;
    name_localizations?: string;
    description?: string;
    description_localizations?: string;
    required?: boolean;
    choices?: Array<string>;
    options?: Array<string>;
    channel_types?: Array<string>;
    min_value?: number;
    max_value?: number;
    autocomplete?: boolean;
    default?: string;
    default_member_permissions?: string;
    dm_permission?: boolean;
    aliases?: Array<string>;
    execute?: Function;
    help?: string;
    hide?: boolean;
    [key: string]: any;
}

interface ILibs {
    [key: string]: ICommand;
}

const log = (...args: any[]) => console.log('파일관리자]', ...args);

const loadFile = (dir: string, libs: ILibs) => {
    const name = path.basename(dir, dir.endsWith('.js') ? '.js' : '.ts');
    try {
        const cmd = require(dir);
        log(dir);
        libs[name] = cmd;
    } catch (e) {
        error(e);
        log('Error', dir);
        delete libs[name];
    }
};
const commandOptionNames = [
    'type',
    'name',
    'name_loaclizations',
    'description',
    'description_loaclizations',
    'required',
    'choices',
    'options',
    'channel_types',
    'min_value',
    'max_value',
    'autocomplete',
    'default',
    'default_member_permissions',
    'dm_permission',
];

export default function getCommands(target: string) {
    const libs: ILibs = {};
    const commandsFoldes: string[] = fs
        .readdirSync(target)
        .filter(f => f.endsWith('.js') || f.endsWith('.ts'));
    log('지정경로 -', target);
    for (const file of commandsFoldes) {
        loadFile(path.join(target, file), libs);
    }

    const get = (name: string) =>
        libs &&
        (libs[name] ||
            Object.values(libs).find(l => l.aliases?.includes(name)));

    return {
        options: Object.values(libs),
        get,
        forEach(callback: (c: ICommand, name: string) => void) {
            const keys = Object.keys(libs);
            for (const k of keys) {
                callback(libs[k], k);
            }
        },
        getCommands: () =>
            Object.values(libs)
                .filter(c => !c.hide)
                .map(c => {
                    const out: {
                        [key: string]: any;
                    } = {};
                    for (const optionName of commandOptionNames)
                        if (optionName in c) out[optionName] = c[optionName];
                    return out;
                })
                .map(c => ({
                    default_member_permissions: '0', // ViewChannel
                    dm_permission: false, // dmChannel
                    ...c,
                })),
    };
}
