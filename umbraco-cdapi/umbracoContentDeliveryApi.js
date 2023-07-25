const configManager = require('./configManager');
const config = configManager.getConfig();

const callContentDeliveryApi = async (url) => {
    let items;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'api-key': config.apiKey,
                'preview': config.previewEnabled
            }
        });
        items = response.json();
        console.log(items);
    } catch (e) {
        console.log(e);
    }

    return items;
}

export async function fetchItems({ expand = null, filter = null, skip = null, take = null }) {
    let url = `${config.domain}/umbraco/delivery/api/v1/content/?`;
    url = addExpand(url, expand);
    url = addFilter(url, filter);
    url = url + "&sort=createDate:desc"

    console.log(url);
    return callContentDeliveryApi(url);
}


export async function fetchItem(pathOrId, expand) {
    let url = `${config.domain}/umbraco/delivery/api/v1/content/item/${pathOrId}?`;
    url = addExpand(url, expand);

    console.log(url);
    return callContentDeliveryApi(url);
}

const addExpand = (url, expand) => {
    if (expand) {
        return `${url}expand=property:${expand}&`;
    }
    return url;
}

const addFilter = (url, filter) => {
    if (filter) {
        return `${url}filter=contentType:${filter}&`;
    }
    return url;
}