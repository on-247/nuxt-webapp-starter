type AllKeys<T> = T extends unknown ? keyof T : never

export function pick<O, K extends AllKeys<O>>(
    base: O,
    keys: readonly K[],
    omitEmpty = true
): Pick<O, K> {
    let entries = keys.map(key => [key, base?.[key]])

    if (omitEmpty) {
        entries = entries.filter(([_, v]) => !!v || v == 0)
    }

    return Object.fromEntries(entries)
}