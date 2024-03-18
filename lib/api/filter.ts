enum Operator
{
    EQUAL = 'eq',
    GREATER_THAN = 'gt',
    GREATER_EQUAL = 'ge',
    LOWER_THAN = 'lt',
    LOWER_EQUAL = 'le',
    IN = 'in',
    NOT_IN = 'notin',
    BETWEEN = 'between',
    LIKE = 'like',
    INSEN_LIKE = 'ilike',
    NOT_LIKE = 'notlike',
    INSEN_NOT_LIKE = 'notilike',
    STARTS_WITH = 'startswith',
    ENDS_WITH = 'endswith',
    CONTAINS = 'contains'
}

type FilterMethod = (column: string, ...values: any[]) => Filter

export class Filter
{
    column: string
    operator: string
    value: string
    _type?: string

    static eq: FilterMethod
    static gt: FilterMethod
    static ge: FilterMethod
    static lt: FilterMethod
    static le: FilterMethod
    static in: FilterMethod
    static notin: FilterMethod
    static between: FilterMethod
    static like: FilterMethod
    static ilike: FilterMethod
    static notlike: FilterMethod
    static notilike: FilterMethod
    static startswith: FilterMethod
    static endswith: FilterMethod
    static contains: FilterMethod

    constructor(column: string, operator: string, value: string, type?: string)
    {
        this.column = column
        this.operator = operator
        this.value = value
        this._type = type
    }

    public type(type: string): Filter
    {
        this._type = type
        return this
    }

    public toString()
    {
        return this._type
            ? `${this.column}=${this.operator}<${this._type}>(${this.value})`
            : `${this.column}=${this.operator}(${this.value})`
    }
}

for(const [,operator] of Object.entries(Operator))
{
    Object.assign(Filter, {
        [operator]: (column: string, value: string) => {
            return new Filter(column, operator, value)
        }
    })
}

for(const operator of [Operator.IN, Operator.NOT_IN, Operator.BETWEEN])
{
    Object.assign(Filter, {
        [operator]: (column: string, ...values: any[]) => {
            return new Filter(column, operator, values.join(','))
        }
    })
}