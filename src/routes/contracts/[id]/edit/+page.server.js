//TODO: Function to load current contract from DB.
//TODO: Function to load customer / service name from contract Id.


//TODO: Function to get updated customer / service id from updated names.
//TODO: Function to send updated contract info to DB

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

//going to edit get contract to also return names.

export async function load({ fetch, params}){
    const contractId = params.id;
    console.log(`id: ${contractId}`)
    try{
        const res = await fetch(`https://localhost:7246/contractInfo?contractId=${contractId}`)
        if (!res.ok){
            throw new Error(`Error status: ${res.status}`);
        }
        const info = await res.json()
        if (!info || info.length === 0){
            return {
                found: false,
                contract: null,
                error: null
            }

        }
        return {
            found: true,
            contract: info,
            error: null
        };

    } catch (error) {
        console.log(`error: ${error.message}`)
        return {
            found: false,
            contract: null,
            error: error.message
        };
    }




}


export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();

        testContract = {
            ...testContract,
            customerName: data.get('customerName'),
            serviceName: data.get('serviceName'),
            price: data.get('price'),
            currentTermStart: data.get('currentTermStart'),
            currentTermEnd: data.get('currentTermEnd')

        };

        return { success: true, contract: testContract}
    }
};


