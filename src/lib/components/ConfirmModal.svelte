<script>
let dialog = $state()
let { deleteContract } = $props()

export function open(){
    dialog.showModal();
}

export function close(){
    
    dialog.close();
}

</script>

<dialog bind:this={dialog}>
    <button onclick={ close }>Cancel</button>
    <button onclick={ deleteContract }>Confirm</button>
</dialog>