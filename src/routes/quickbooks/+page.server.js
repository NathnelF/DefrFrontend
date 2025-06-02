export const actions = {
    upload: async ( {request, fetch }) => {
        const data = await request.formData();

        const file = data.get("csvFile")
        if (file && typeof file !== "string"){
            try { 
                const text = await file.text()
                //send the text to api endpoint!

            } catch (error) {
                return {
                    success: false,
                    error: error.message
                }
            }
        }
        else {
            return {
                success: false,
                error: "Actual file required."
            }
        }
        

}
}