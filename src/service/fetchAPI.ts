export const getAPI = async (api: string) => {
    const res = await fetch(api, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (res.redirected) {
        window.location.href = res.url;
        return;
    }
    if (res.status === 404) {
        return false;
    }
    return await res.json();
}

export const postAPI = async (api: string, body: object) => {
    const res = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    return await res.json();
}

export const putAPI = async (api: string, body: object) => {
    const res = await fetch(api, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    return await res.json();
}