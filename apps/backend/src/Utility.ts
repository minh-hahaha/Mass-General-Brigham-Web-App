export interface QueryOptions {
    sortOptions: object[];
    filterOptions: object[];
    maxQuery: number | undefined;
}

export function buildQuery(options: QueryOptions) {
    const args = {
        select: {},
        take: options.maxQuery,
        orderBy: options.sortOptions,
    };
    args.select = Object.assign({}, ...options.filterOptions);
    return args;
}
