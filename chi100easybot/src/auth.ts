import Storage from 'src/shared';

export default class AuthStorage extends Storage {

    set auth(value: string) {
        this.addItem('auth', value);
    }

    get auth(): string {
        return this.getItem('auth');
    }

}
