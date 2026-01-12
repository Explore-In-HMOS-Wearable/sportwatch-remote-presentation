import { keepScreenOn } from '../../common/js/utils';
import { Builder, Message, P2pClient } from '../../util/wearengine';

export default {
    data: {
        initialized: false,
        error: null, // error message
        presentation: null, // Presentation object
        p2pClient: null,
        builderClient: null
    },
    onInit() {
        keepScreenOn();

        const androidAppBundleName = ''; // TODO: put mobile app bundle id
        const androidAppFingerprint = ''; // TODO: put mobile app fingerprint

        this.p2pClient = new P2pClient();
        this.p2pClient.setPeerPkgName(androidAppBundleName);
        this.p2pClient.setPeerFingerPrint(androidAppFingerprint);

        this.builderClient = new Builder();

        this.init();
    },

    init() {
        this.initialized = false;
        this.checkApp();
    },

    checkApp() {
        const that = this;
        this.p2pClient.ping({
            onSuccess: function () {
                console.info('check app success');
            },
            onFailure: function () {
                console.info('ping failed');
            },
            onPingResult: function (result) {
                if (result.code === 205) {
                    console.info('app exists');
                    that.setMessageReceiver();
                } else {
                    console.info('app does not exist');
                    that.error = 'PresentationRemote is not installed on the phone.';
                    that.initialized = true;
                }
            }
        });
    },

    setMessageReceiver() {
        const that = this;
        this.p2pClient.registerReceiver({
            onSuccess: function () {
                console.info('registerReceiver success');

                // ask for presentation
                that.sendMessage('presentation');

                that.initialized = true;
            },
            onFailure: function (e) {
                console.info(`registerReceiver on fail ${e}`);
            },
            onReceiveMessage: function (str) {
                console.info(str);
                const index = str.indexOf(' ');
                const code = parseInt(str.substring(0, index));
                console.info(`code ${code}`);
                const data = str.substring(index + 1);
                console.info(`|${data}|`);

                if (code === 0) { // got presentation
                    console.info('got pre ');
                    try {
                        that.presentation = JSON.parse(data);
                        console.info(`presentation ${that.presentation}`);
                    } catch (e) {
                        console.info(`parse error, ${e}, ${JSON.stringify(e)}`);
                    }
                }
            }
        });
    },

    sendMessage(msg) {
        console.info(`sendMessage:${msg}`);
        let message = new Message();
        this.builderClient.setDescription(msg);
        message.builder = this.builderClient;
        this.p2pClient.send(message, {});
    }
};
