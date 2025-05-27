<script>
    let { contract, form } = $props();
    import { enhance } from '$app/forms';
    import { readableDate } from '../../../../lib/utils/dateConverter.js'

</script>



    <label class="my-2">
        Customer Name:
        <input name="customerName" value={contract.customerName} class="pl-1"/>
    </label>

    <label class="my-2">
        Service Name:
        <input name="serviceName" value={contract.serviceName} class="pl-1"/>
    </label>

    <label class="my-2">
        Annual Amount:
        <input name="price" value={contract.price} class="pl-1"/>
    </label>

    <!-- <label class="my-2">
        Original Contract Start:
        <input name="originalContractStart" bind:value={contract.originalContractStart} class="pl-1"/>
    </label> -->

    <label class="my-2">
        Customer Term Start:
        <input name="currentTermStart" value={readableDate(contract.currentTermStart)} class="pl-1"/>
    </label>

    <label class="my-2">
        Customer Term End:
        <input name="currentTermEnd" value={readableDate(contract.currentTermEnd)} class="pl-1"/>
    </label>

    <label class="my-2">
        Term Length:
        <input name="termLength" value={contract.termLength} class="pl-1"/>
    </label>

    <!-- <label class="my-2">
        isAutoRenew:
        <input name="isAutoRenew" bind:value={contract.isAutoRenew} class="pl-1"/>
    </label> -->

    <!-- <label class="my-2">
        Renewal Price Increase:
        <input name="renewalPriceIncrease" bind:value={contract.renewalPriceIncrease} class="pl-1"/>
    </label> -->



