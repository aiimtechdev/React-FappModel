const HEADERS = { 'Content-Type': 'application/json' };
import { toast } from 'react-toastify';

export const apiRequest = async (
    url,
    method,
    body = undefined,
    token = false,
) => {
    const resolveResp = {};
    const options = {
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    };
    options.method = method;
    let toastHandle = true;
    try {
        if (method !== 'GET' && method !== 'HEAD' && typeof body !== 'undefined')
            options.body = JSON.stringify(body);
        if (token) {
            const additionalHeader = {};
            if (token) additionalHeader.Authorization = `bearer ${token}`;
            options.headers = { ...HEADERS, ...additionalHeader };
        } else options.headers = HEADERS;
        const response = await fetch(import.meta.env.VITE_API_HOST + url, options);
        if (response.status === 200 || (method == 'POST' && response.status === 201)) {
            resolveResp.status = 'success';
            resolveResp.data = await response.json();
        } else {
            if (response.status === 201) {
                resolveResp.status = 'failed';
                const data = await response.json();
                resolveResp.msg = Object.values(data).json('\n');
            } else if (response.status === 422 || response.status === 400) {
                resolveResp.status = 'Invalid Data';
                const data = await response.json();
                if (typeof data.message == 'string') resolveResp.msg = data.message;
                else resolveResp.msg = Object.values(data.message).join('\n');
            } else if (response.status === 401) {
                const data = await response.json();
                if (window.location.pathname == '/login') resolveResp.msg = data.message.replace(',', '\n');
                else {
                    resolveResp.msg = Object.values(data).join('\n');
                    if ((resolveResp.msg && resolveResp.msg === 'Token is Expired') || !localStorage.getItem("token"))
                        localStorage.setItem("Ermsg", "Session Expired!\n Please login again to continue.");
                    else localStorage.setItem("Ermsg", resolveResp.msg);
                    toastHandle = false;
                    setTimeout(() => {
                        localStorage.removeItem("token");
                        location.reload();
                    }, 100);
                }
            } else if (response.status === 403) {
                const data = await response.json();
                resolveResp.msg = Object.values(data).join('\n');
                setTimeout(() => { location.reload(); }, 4000);
            } else if (response.status >= 400 && response.status < 500) {
                resolveResp.status = 'Invalid Request!';
                resolveResp.msg = 'Something went wrong. Please try again later.';
            } else if (response.status >= 500) {
                resolveResp.status = 'Server Error!';
                resolveResp.msg = 'Internal Server Error Occurred. Please try again later.';
            }
            if(toastHandle) toast.error(resolveResp.msg, { hideProgressBar: false, closeOnClick: true });
        }
    } catch (error) { console.error(error); }
    return resolveResp;
}