export interface QueryOptions {
    sortOptions: object[]; // Array of options to sort data by
    filterOptions: object[]; // Array of options to filter data by
    maxQuery: number | undefined; // The first x rows to return. Specify undefined if you want all
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
