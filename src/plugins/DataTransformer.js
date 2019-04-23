import { stringify } from 'qs'

export function DataTransformer(url, method, data) {
    url = url || '';
    method = method || 'GET';
    if ('GET' === method) {
        data = data instanceof FormData ? null : stringify(data);
        url = data && `${url}?${data}` || url;
        data = null;
    } else {
        data = data instanceof FormData ? data : JSON.stringify(data || {});
    }
    return {
        url,
        fetchOptions: {
            body: data,
            credentials: 'include',
        }
    };
}