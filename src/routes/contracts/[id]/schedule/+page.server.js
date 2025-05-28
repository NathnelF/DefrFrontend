export async function load({ fetch, params}){
    const contractId = params.id;

    const scheduleUrl = `https://localhost:7246/schedules?contractId=${contractId}`;
    const invoiceDateUrl = `https://localhost:7246/invoiceDate?contractId=${contractId}`;

    const [scheduleRes, invoiceDateRes] = await Promise.all([
        fetch(scheduleUrl),
        fetch(invoiceDateUrl)
    ]);

    let schedule = [];
    let date = null
    let found = false;
    let error = null;

    if (!scheduleRes.ok){
        error = await scheduleRes.text();
    } else{ 
        schedule = await scheduleRes.json();
        if (schedule && schedule.length > 0) {
            found = true;
        }
    }

    if (!invoiceDateRes.ok){
        error = await invoiceDateRes.text();
    } else{
        const invoiceData = await invoiceDateRes.json();
        date = invoiceData.invoiceDate;
    }

    return {
        found,
        events: schedule,
        date,
        error
    };

}