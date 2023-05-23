// --------------------------------------------------------------------------

// Local Storage (Max Score)

const key: string = "qsm_record";
function getRecordScore():number | null {
    const record = localStorage.getItem(key);
    if(record) return parseInt(record);
    return null;
}
function setRecordScore(newScore: number):void {
    localStorage.setItem(key, String(newScore));
}

export { getRecordScore, setRecordScore };

// --------------------------------------------------------------------------

// Scroll to Top

function scrollToTop():void {
    window.scroll({
        top: 0,
        behavior: "smooth"
    });
}

export { scrollToTop };

// --------------------------------------------------------------------------