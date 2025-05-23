<script>
    let { contract } = $props();
    import { enhance } from '$app/forms';
    
</script>


<form method="POST" class="flex flex-col p-4 mx-2" use:formEnhance>
    <label class="my-2">
        Customer Name:
        <input name="customerName" bind:value={contract.customerName} class="pl-1"/>
    </label>

    <label class="my-2">
        Service Name:
        <input name="serviceName" bind:value={contract.serviceName} class="pl-1"/>
    </label>

    <label class="my-2">
        Annual Amount:
        <input name="price" bind:value={contract.price} class="pl-1"/>
    </label>

    <label class="my-2">
        Customer Term Start:
        <input name="currentTermStart" bind:value={contract.currentTermStart} class="pl-1"/>
    </label>

    <label class="my-2">
        Customer Term End:
        <input name="currentTermEnd" bind:value={contract.currentTermEnd} class="pl-1"/>
    </label>

    <button type="submit">Save</button>

</form>




