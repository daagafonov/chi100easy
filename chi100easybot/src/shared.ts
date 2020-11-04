export default class Storage {

    private storage: [] = [];

    addItem(key: string, value: string) {
        this.storage.push({
            key,
            value,
        });
    }

    getItem(key: string) {
        return this.storage.filter(item => item.key === key)[0].value;
    }

}


