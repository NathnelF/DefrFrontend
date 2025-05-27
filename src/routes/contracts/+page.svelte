<script>
    import ContractTable from "./ContractTable.svelte";
    let { data } = $props();

    let { error, contracts } = data;

    
    const names = {
        customerName: "Test Customer",
        serviceName: "Test Service"
    };

</script>

{#if error}
<p class="text-2xl font-bold p-3 text-left">Can't load data. Check database conenction.</p>
{:else}
<ContractTable contracts={contracts} names={names} />
{/if}
<a class="btn" href="/contracts/create">Create Contract</a>