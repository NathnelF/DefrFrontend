process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { error } from "@sveltejs/kit";

export const actions = {
    upload: async ( {request, fetch }) => {
        console.log('upload action started!')
        const data = await request.formData();

        const file = data.get("csvFile")
        if (file && typeof file !== "string"){
            try { 
                const csvData = await file.text()
                
                //send the text to api endpoint!
                if (!csvData || csvData.length === 0) {
                    console.log(`csv is empty`)
                    return {
                        success: false,
                        error: `Csv is empty`,
                        result: null
                    }
                }
                console.log(`${csvData.substring(0, 20)}`)
                const url = "https://localhost:7246/post_qb_events"
                const res = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({csvContent: csvData})
                    })
                    console.log('Frontend: response status', res.status)
                    if (!res.ok) {
                        const errorText = await res.text()
                        console.log(`error: ${errorText}`)
                        return {
                            success: false,
                            error: `Error encountered: ${errorText}`,
                            result: null
                        }
                    }
                    const result = await res.json()
                    return {
                        success: true,
                        error: null,
                        result: result
                    }


            } catch (error) {
                console.log(`error on backend call ${error.message}`)
                console.log('full error: ', error)
                return {
                    success: false,
                    error: error.message,
                    result: null
                }
                
            }
        }
        else {
            console.log(`Generated file`)
            return {
                success: false,
                error: "Actual file required.",
                result: null
            }
        }
        

}
}
