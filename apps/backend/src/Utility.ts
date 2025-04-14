import { DIRECTORY_FILTER_OPTIONS } from './routes/directory.ts';

export interface QueryOptions {
    sortOptions: any;
    filterOptions: any[];
    maxQuery: number | undefined;
}

export function buildQuery(options: QueryOptions) {
    const args = {
        select: {},
        take: options.maxQuery,
        orderBy: options.sortOptions,
    };
    args.select = Object.assign(
        {},
        ...options.filterOptions.map((opt) => DIRECTORY_FILTER_OPTIONS[opt])
    );
    return args;
}

export function buildGetRequest(route: any, options: QueryOptions) {
    console.log();
}
