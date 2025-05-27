<script>
    import EditForm from "./EditForm.svelte";


    //TODO: grab the contract info from the server

    let { data, form } = $props();
    let { found, contract, error} = data;
</script>


{#if error}
<p class="text-2xl font-bold p-3 text-left">Can't load data. Check database conenction.</p>
{:else if !contract}
<p class="text-2xl font-bold p-3 text-left">Contract Id does not exist.</p>
{:else}
<form method="POST" class="flex flex-col p-4 mx-2">
    <EditForm contract={contract}/>
    <button type="submit">Save</button>
</form>

{/if}

{#if form?.error}
<p>{form?.error}</p>
{/if}