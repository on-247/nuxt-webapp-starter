import {ofetch} from 'ofetch'
import {pick} from './util'
import {type Filter} from './filter'
import {EVENTS_AUTH_UNAUTHENTICATED} from '~/constants'

interface ClientOptions
{
    baseUrl: string
    apiKey: string
}

interface RequestArgs
{
    uri: string
    method: string
    query?: Record<string, string | number>
    body?: any
    headers?: Record<string, string>
}

interface Route
{
    uri: string[];
    method: string;
    body?: string[];
    query?: string[];
}

type APISpec = Record<
    string, {
        [endpointOrRoute: string]:
            | Route
            | APISpec;
    }
>

export class Client
{
    baseUrl: string
    apiKey: string
    events?: any

    [endpointOrRoute: string]: any

    constructor(options: ClientOptions, spec: APISpec, events: any)
    {
        this.baseUrl = options.baseUrl
        this.apiKey = options.apiKey
        this.addEndpoints(this, spec)
        this.events = events
    }

    /**
     * Recursively add endpoints to a given client object, or routes to a given endpoint object.
     */
    private addEndpoints(clientOrEndpoint: any, spec: Record<string, any>)
    {
        for (const key in spec) {
            const endpointOrRoute = spec[key]
            // Test if object is an endpoint object which contains one or more routes.
            if (!('uri' in endpointOrRoute)) {
                clientOrEndpoint[key] = {}
                this.addEndpoints(clientOrEndpoint[key], endpointOrRoute)
            }
            // Else create route function on endpoint object.
            else clientOrEndpoint[key] = this.addRoute(endpointOrRoute)
        }
    }

    /**
     * Returns an async route function.
     */
    private addRoute(spec: Route)
    {
        return (args?: Record<string, any>) => {
            // Resolve sorts
            if (args && ('sorts' in args)) {
                args.sorts = args.sorts.toString()
            }
            // Resolve filters
            if (args && ('filters' in args)) {
                args.filters = args.filters
                    .map((filter: string | Filter) => filter.toString())
                    .join('|')
            }
            // Pick other request information from args
            let method = spec.method
            let query = pick(args ?? {}, spec.query ?? [])
            let body = method.toLowerCase() !== 'get' ? pick(args ?? {}, spec.body ?? [], method === 'post' ? false : true) : null
            let headers = args?.headers ?? {}
            // Make fetch request
            return this.makeRequest({
                uri: this.createUri(spec.uri, args),
                method,
                query,
                body,
                headers
            })
        }
    }

    /**
     * Returns a single URI string and applies named parameters if found.
     * 
     * Example: ['user', '{id}'] => `/user/${id}`
     * Where `id` is then retrieved from the `args` object.
     */
    private createUri(parts: string[], args?: Record<string, any>)
    {
        return !args
            ? parts.join('/')
            : parts
                .map(part => {
                    let isParam = part.includes('{') && part.includes('}')
                    let paramVar = part.replace('{', '').replace('}', '')
                    return isParam
                        ? args[paramVar]
                        : part
                })
                .join('/')
    }

    /**
     * Make a fetch request.
     */
    private async makeRequest(args: RequestArgs)
    {
        try {
            return await ofetch(
                args.uri, {
                baseURL: this.baseUrl,
                method: args.method,
                query: args?.query,
                body: args?.body,
                headers: {
                    ...(args?.headers || {}),
                    'X-Api-Key': this.apiKey
                }
            })
        }
        catch (e: any) {
            if (e.statusCode == 401) {
                this.events?.emit(EVENTS_AUTH_UNAUTHENTICATED)
            }
            throw e
        }
    }
}