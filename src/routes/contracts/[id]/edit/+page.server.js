//TODO: Function to load current contract from DB.
//TODO: Function to load customer / service name from contract Id.


//TODO: Function to get updated customer / service id from updated names.
//TODO: Function to send updated contract info to DB

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { redirect } from '@sveltejs/kit';
import { IsoDate } from '../../../../lib/utils/dateConverter.js'

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


async function getIdByNames({fetch}, customerName, serviceName){
    try{
        const res = await fetch(`https://localhost:7246/namesToId?customerName=${customerName}&serviceName=${serviceName}`);

        if (!res.ok) {
            const errorText = await res.text();
            //console.log(`Error: ${res.status}: ${errorText}`)
            return {
                found: false,
                customerId: null,
                serviceId: null,
                error: errorText
            };
        }
        const info = await res.json();
            return {
                found: true,
                customerId: info.customerId,
                serviceId: info.serviceId,
                error: null
            };

    } catch (error){
        return {
            found: false,
            customerId: null,
            serviceId: null,
            error: error.message
        };
    }
}


export const actions = {
    default: async ({ request, fetch, params }) => {
        const contractId = params.id;
        const data = await request.formData();
        let {found, customerId, serviceId, error} = await getIdByNames({fetch}, data.get('customerName'), data.get('serviceName'));
        if (error) {
            console.log("error on id")
            return {
                success: false,
                error: error
                
            }
        }

        if (!found ) {
            console.log("can't find ids")
            return {
                success: false,
                error: "Could not find ids based on Customer and Service names."
            }
        }

            let IsoStart
            let IsoEnd
            try {
                IsoStart = IsoDate(data.get('currentTermStart'));
                console.log(`IsoStart: ${IsoStart}`)
                IsoEnd = IsoDate(data.get('currentTermEnd'));
                console.log(`IsoEnd: ${IsoEnd}`)
            } catch (dateError) {
                return {
                    success: false,
                    error: dateError.message
                };
            }
            

            const testContract = {
            customerId: customerId,
            serviceId: serviceId,
            price: data.get('price'),
            currentTermStart: IsoStart,
            currentTermEnd: IsoEnd,
            termLength: data.get('termLength'),

        };

                //console.log("Sending update to backend:", testContract);
                let res;
                try {
                    res = await fetch(`https://localhost:7246/update_contract?contractId=${contractId}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(testContract)
                    });
                } catch (error) {
                    //console.log("error updating contract");
                    return {
                        success: false,
                        error: error.message
                    }
                }
             

                //console.log("Response status:", res.status);
                if (!res.ok) {
                    const updateError = await res.text()
                    return {
                        success: false,
                        error: updateError
                    }
                }
                
                    console.log("Redirecting to /contracts");
                    throw redirect(303, '/contracts');
            
              
    }
};


