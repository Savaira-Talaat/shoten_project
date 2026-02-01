import {vi} from "vitest";

export function mockFetch(responses: Record<string, any>) {
    vi.stubGlobal('fetch', vi.fn((url: string) => {
        const matchingKey = Object.keys(responses).find((key) => url.includes(key));
        if (matchingKey) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(responses[matchingKey]),
            })
        }
        return Promise.resolve({
            ok: false,
            json: () => Promise.reject(new Error('URL non mockée'))
        })
    }))
}