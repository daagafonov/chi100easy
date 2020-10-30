import mitt from 'mitt';

const emitter = mitt();

export default class EventService {

    static subscribeEvent(eventName: string, callback: (payload: any) => void) {
        emitter.on(eventName, callback );
    }

    static sendEvent(eventName: string, payload: any) {
        emitter.emit(eventName, payload);
    }

    static deleteSubsriber(eventName: string) {
        emitter.off(eventName, () => {});
    }
}
