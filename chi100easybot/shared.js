
class LocalStorage {
    constructor() {
        this.storage = [];
    }

    addItem(key, value) {
        this.storage.push({
            key,
            value,
        });
    }

    getItem(key) {
        return this.storage.filter(item => item.key === key)[0].value;
    }
}

class AuthStorage extends LocalStorage {

    set auth(value) {
        this.addItem('auth', value);
    }

    get auth() {
        return this.getItem('auth');
    }

}

module.exports = {
    authStorage: new AuthStorage(),
    AuthStorage,
    LocalStorage,
};


