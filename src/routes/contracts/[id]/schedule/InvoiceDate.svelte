<script>
    import Flatpickr from "$lib/components/Flatpickr.svelte";

    //the only prop he should need is a contractId

    //TODO: Await fetch invoiceDate per contract ID

    //TODO: Add a handler to post contract invoiceDate if none exist

    //TODO: Add a handler to put contract invoiceDate if one exists.

    //TODO: Add a handler to put recogntion schedule value update at invoice date.
</script>

<Flatpickr id={"invoice-date"} label="Invoice Date" />
