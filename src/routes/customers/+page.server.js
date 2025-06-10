export async function load({ fetch }) {
    try {
        const res = await fetch("https://localhost:7246/customers")
        if (!res.ok) {
            let errorMesage = await res.json()
            return {
                customers: null,
                success: false,
                error: errorMesage
            }
        } else {
            const data = await res.json();
            return {
                customers: data,
                success: true,
                error: null
            }
        }

    } catch (error) {
        return {
            customers: null,
            success: false,
            error: error.message
        }

    }
}