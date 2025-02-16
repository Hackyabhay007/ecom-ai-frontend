export const cleanBaseUrl = (url) => {
    if (!url) return 'http://localhost:9000';
    return url.replace(/;$/, '').replace(/\/$/, '');
};

export const BASE_URL = cleanBaseUrl(process.env.NEXT_PUBLIC_API_URL);

export const createApiUrl = (path) => {
    console.log("Path:", path);
    const url = new URL(path, BASE_URL);
    console.log("URL:", url.toString());
    return url.toString();
};
