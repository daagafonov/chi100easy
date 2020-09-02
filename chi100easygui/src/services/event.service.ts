import EventBus from '@/services/eventBus.ts';

export default class EventService {

    static subscribeEventOnce(eventName: string, callback: Function) {
        EventBus.$once(eventName, (payload: any) => {
            callback(payload);
        });
    }

    static subscribeEvent(eventName: string, callback: Function) {
        EventBus.$on(eventName, (payload: any) => {
            // console.log('subscribed event [%s] is called with [%o]', eventName, JSON.stringify(payload));
            callback(payload);
        });
    }

    static sendEvent(eventName: string, payload: any) {
        EventBus.$emit(eventName, payload);
    }

    static deleteSubsriber(eventName: string) {
        EventBus.$off(eventName);
    }
}
