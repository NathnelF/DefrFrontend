
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
export async function load({ fetch }) {

    try{
        const res = await fetch('/contracts')
        if (!res.ok){
            console.log(res.status)
            return {
                error: res.status,
                contracts: []
            }
        }
        const data = await res.json()
        if (!data || data.length === 0){
            return {
                error: null,
                contracts: []
            }
        }
        else{
            return {
                error: null,
                contracts: data
            }
        }

    } catch (error) {
        console.log(error.message)
        return { error: error.message };
    }   
    
}