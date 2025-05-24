const formatter = new Intl.DateTimeFormat("en-US", {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
});

export function formatDate(string) {
    return string ? formatter.format(new Date(string)) : "";
}
