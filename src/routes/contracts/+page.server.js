
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
export async function load({ fetch }) {

    try{
        const res = await fetch('http://localhost:5025/contracts')
        if (!res.ok){
            console.log(res.status)
            throw new Error(`Response status ${res.status}`)
        }
        const contracts = await res.json()
        return { contracts }

    } catch (error) {
        console.log(error.message)
        return { error: error.message };
    }   
    
}