process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
export async function load({ fetch, params }){
    const contractId = params.id;
    try{
        const res = await fetch(`https://localhost:7246/schedules?contractId=${contractId}`)
        if (!res.ok){
            throw new Error(`Error status: ${res.status}`);
        }
        const schedule = await res.json()
        if (!schedule || schedule.length === 0){
            return {
                found: false,
                events: [],
                error: null
            }

        }
        return {
            found: true,
            events: schedule,
            error: null
        };

    } catch (error) {
        return {
            found: false,
            events: [],
            error: error.message
        };
    }



}

