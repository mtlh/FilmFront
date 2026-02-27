export function WatchlistAZ(a: any, b: any) {
    if (a.itemname === b.itemname) {
        return 0;
    }
    else {
        return (b.itemname > a.itemname) ? -1 : 1;
    }
}

export function WatchlistZA(a: any, b: any) {
    if (a.itemname === b.itemname) {
        return 0;
    }
    else {
        return (b.itemname < a.itemname) ? -1 : 1;
    }
}

export function WatchlistNewest(a: any, b: any) {
    if (Date.parse(a.added) === Date.parse(b.added)) {
        return 0;
    }
    else {
        return (Date.parse(b.added) > Date.parse(a.added)) ? -1 : 1;
    }
}

export function WatchlistOldest(a: any, b: any) {
    if (parseInt(Date.parse(a.added).toString()) === parseInt(Date.parse(b.added).toString())) {
        return 0;
    }
    else {
        return parseInt(Date.parse(b.added).toString()) < parseInt(Date.parse(a.added).toString()) ? -1 : 1;
    }
}