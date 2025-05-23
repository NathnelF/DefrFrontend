<script>
    import ContractTable from "./ContractTable.svelte";
    let { data } = $props();

    let { contracts } = data;

    
    const names = {
        customerName: "Test Customer",
        serviceName: "Test Service"
    };

</script>

<ContractTable contracts={contracts} names={names} />