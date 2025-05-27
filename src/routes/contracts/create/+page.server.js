process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { IsoDate } from '../../../lib/utils/dateConverter.js'
import { redirect } from '@sveltejs/kit';


export const actions = {
    default: async ( {request, fetch } ) => {
        const data = await request.formData();
        let IsoStart;
        let IsoEnd;
        let IsoOriginal;
        console.log("test1")

        try {
            IsoStart = IsoDate(data.get("currentTermStart"));
            IsoEnd = IsoDate(data.get("currentTermEnd"));
            IsoOriginal = IsoDate(data.get("originalContractStart"))
            console.log("Test2")

        } catch (dateError) {
            return {
                success: false,
                error: dateError.message
            }
        }
        console.log("test3")
        const contract = {
            customerName: data.get("customerName"),
            serviceName: data.get("serviceName"),
            price: data.get("price"),
            currentTermStart: IsoStart,
            currentTermEnd: IsoEnd,
            termLength: data.get("termLength"),
            originalContractStart: IsoOriginal
        };
        console.log("test4")

        let res
        console.log("try to post: ", contract);
        try {
            res = await fetch("https://localhost:7246/new_contract", 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contract)
            });
        } catch (error) {
            console.log(error.message)
            return {
                success: false,
                error: error.mesage
            }
        }

        if (!res.ok){
            const postError = await res.text()
            console.log(postError);
            return {
                success: false,
                error: postError
            }
        }
        const info = await res.json()
        console.log(info)
        throw redirect(303, '/contracts');

    }
}