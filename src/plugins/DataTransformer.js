import { stringify } from 'qs'

export function DataTransformer(url, data, method) {
    url = url || '';
    method = method || 'GET';
    if ('GET' === method) {
        data = data instanceof FormData ? null : stringify(data);
        url = `${url}?${data}`;
        data = null;
    } else {
        data = data instanceof FormData ? data : JSON.stringify(data);
    }
    return {
        url,
        fetchOptions: { body: data }
        // fetchOptions: { },
        // credentials: 'same-origin',
        // headers: {
        //     'Access-Control-Allow-Origin': 'http://localhost:1024'
        // }
    };
}