export declare type Dictionary<T> = {
    [property: string]: T;
};
export declare function getOrDefault<T>(object: Dictionary<T>, key: string, defaultValue: T): T;
export declare function defaultValue<T>(value: T | undefined, defaultValue: T): T;
export declare function pick<T, K extends keyof T>(object: T, keys: ReadonlyArray<K>): Pick<T, K>;
export declare function trim(text: string): string;
export declare function md5(original: string): string;
export declare function unique<T>(array: T[], identify?: (value: T) => string): T[];
export declare function makeDirectoryRecursively(directoryPath: string): Promise<void>;
