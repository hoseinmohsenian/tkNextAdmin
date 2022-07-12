export function checkResponseArr(responses) {
    for (let i = 0; i < responses.length; i++) {
        if (responses[i].status === 403) {
            return false;
        }
    }
    return true;
}
