import queryString from 'query-string';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const paths = {
    stores: '/store/'
};

export let storesHash = new Map();

export function getStores(queryParams) {
    const storeUrl = `${SERVER_URL}${paths.stores}?` + queryString.stringify(queryParams);
    return fetch(storeUrl).then((res) => {
        return res.json();
    }, (err) => {
        console.log(err);
    });
}

export function updateStoresWithNewData(newStores) {
    const existingStores = Array.from(storesHash.values());
    if (existingStores.length + newStores.length > 20) {
        const toBeDeleted = newStores.length > 20 ? 20 : newStores.length;
        for (let i = 0; i < toBeDeleted; i++) {
            existingStores[i] && storesHash.delete(existingStores[i].id);
        }
    }
    if (newStores && newStores.length) {
        newStores.forEach(function (store) {
            storesHash.set(store.id, Object.assign(storesHash.get(store.id) || {}, store));
        });
    }
}