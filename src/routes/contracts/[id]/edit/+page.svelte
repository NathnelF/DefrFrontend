<script>
    import EditForm from "./EditForm.svelte";


    //TODO: grab the contract info from the server

    export let data;
    let testContract = data.contract;
</script>

<EditForm testContract={testContract}/>