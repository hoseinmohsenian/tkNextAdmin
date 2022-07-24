export function checkValidPriceKeys(e) {
    const key = e.key;
    // var regex = /[A-Za-z0-9]|\./;
    // if (!regex.test(key)) {
    //     e.preventDefault();
    // }
    let condition =
        (key >= "0" && key <= "9") ||
        [",", "Backspace", "End", "Home", "ArrowRight", "ArrowLeft"].includes(
            key
        );
    if (!condition) {
        e.preventDefault();
    }
}

export function getFormattedPrice(price) {
    let result =
        typeof price === "number"
            ? Intl.NumberFormat().format(price)
            : Intl.NumberFormat().format(price.replace(/,/g, "")) || "";
    return result;
}

export function getUnformattedPrice(formatedPrice) {
    return formatedPrice.replace(/,/g, "");
}
