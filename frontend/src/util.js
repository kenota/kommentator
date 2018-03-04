import CONST from './const'

export function getRecaptchaCallbackName(commentId) {
    if (typeof commentId === 'undefined') {
        commentId = 'root'
    }

    return CONST.RECAPTCHA_CALLBACK + "_" + commentId
}
export function getRecaptchaDivId(commentId) {
    if (typeof commentId === 'undefined') {
        commentId = 'root'
    }
    return CONST.RECAPTCHA_DIV_PREFIX + commentId
}