export interface QueryBuilder {
    sortOptions: object[]; // Array of options to sort data by for backend
    filterOptions: object[]; // Array of options to filter data by for backend
    maxQuery: number | undefined; // The first x rows to return. Specify undefined if you want all for backend
}

export interface QueryOptions {
    sortOptions: number[]; // Array of options to sort data by for frontend
    filterOptions: number[]; // Array of options to filter data by for frontend
    maxQuery: number | undefined; // The first x rows to return. Specify undefined if you want all for frontend
}

export function buildQuery(options: QueryBuilder) {
    const args = {
        select: {},
        take: options.maxQuery,
        orderBy: Object.assign({}, ...options.sortOptions),
    };
    args.select = Object.assign({}, ...options.filterOptions);
    return args;
}
