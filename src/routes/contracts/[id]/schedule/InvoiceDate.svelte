<!-- <script>
    import Flatpickr from "$lib/components/Flatpickr.svelte";
    let { invoiceDate } = $props()
    console.log(invoiceDate)
    let dateExists = $state(false)
    if (invoiceDate != null){
        dateExists = true
    }

    //TODO: Add a handler to post contract invoiceDate if none exist

    //TODO: Add a handler to put contract invoiceDate if one exists.

    //TODO: Add a handler to put recogntion schedule value update at invoice date.
</script>

<div class="flex items-center">
<Flatpickr id={"invoice-date"} label="Invoice Date" value={invoiceDate} />
{#if !dateExists}
<button class="btn mt-6 ml-4">New Date</button>
{:else}
<button class="btn mt-6 ml-4">Update Date</button>
{/if}
</div>

 -->
