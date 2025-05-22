//TODO: Function to load current contract from DB.
//TODO: Function to load customer / service name from contract Id.


//TODO: Function to get updated customer / service id from updated names.
//TODO: Function to send updated contract info to DB


let testContract = {
        customerName: "Test Customer",
        serviceName: "Test Service",
        price: 1000,
        currentTermStart: "2024-05-20T17:31:16.333",
        ccurrentTermEnd: "2025-05-19T17:31:16.333"
};

export const load = () => {
    return { contract: testContract };
};


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


