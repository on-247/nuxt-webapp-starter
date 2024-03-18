

export class Sorts
{
    sorts: Record<string, string>

    constructor(sorts: Record<string, string>)
    {
        this.sorts = sorts
    }

    public toString()
    {
        return Object.entries(this.sorts)
            .map(([c, d]) => `${d}(${c})`)
            .join(',')
    }

    static create(sorts: Record<string, string>)
    {
        return new Sorts(sorts)
    }
}