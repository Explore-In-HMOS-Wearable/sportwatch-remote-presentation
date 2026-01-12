import brightness from '@system.brightness';

export function keepScreenOn() {
    brightness.setKeepScreenOn({
        keepScreenOn: true,
        success: function () {
        },
        fail: function () {
        }
    });
    brightness.setValue({
        value: 180,
        success: function () {
        },
        fail: function () {
        }
    });
}