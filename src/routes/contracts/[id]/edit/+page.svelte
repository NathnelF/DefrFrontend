<script>
    import EditForm from "./EditForm.svelte";


    //TODO: grab the contract info from the server

    let { data } = $props();
    let { found, contract, error} = data;
</script>


{#if error}
<p class="text-2xl font-bold p-3 text-left">Can't load data. Check database conenction.</p>
{:else if !contract}
<p>No info for contract??</p>
{:else}
<EditForm contract={contract}/>
{/if}