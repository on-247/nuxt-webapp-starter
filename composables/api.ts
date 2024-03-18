import { Client } from '~/lib/api/client'
import spec from '~/apispec.json'

interface APIOptions {
    baseUrl: string;
    apiKey: string;
    events?: any;
}

var client: Client


export const useAPI = (options?: APIOptions) => {
    if (options) {
        client = new Client(options, spec, options?.events)
    }

    return client
}