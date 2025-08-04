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

<dialog bind:this={dialog} class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Are you sure you want to delete this contract?</h3>
        <p class="py-4">Press escape or Cancel to close. Delete will delete the contract forever.</p>
         <div class="modal-action">
            <button class="btn" onclick={ close }>Cancel</button>
            <button class="btn bg-red-500" onclick={ deleteContract }>Delete</button>
         </div>
    </div>
</dialog>
