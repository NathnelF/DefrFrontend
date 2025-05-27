<script>
    let { data, form } = $props();
</script>


<form method="POST" class="flex flex-col p-4 mx-2">
    <label class="my-2">
        Customer Name:
        <input name="customerName" class="pl-1" placeholder="Name of NWG Customer" required value="TestCustomer"/>
    </label>

    <label class="my-2">
        Service Name:
        <input name="serviceName"class="pl-1" placeholder="Name of NWG Service" required value="TestService"/>
    </label>

    <label class="my-2">
        Annual Amount:
        <input name="price" class="pl-1" placeholder="Annual amount" required value="1560"/>
    </label>

    <label class="my-2">
        Original Contract Start:
        <input name="originalContractStart" class="pl-1" placeholder="Contract first signed: " required value="1/10/2025"/>
    </label>

    <label class="my-2">
        Customer Term Start:
        <input name="currentTermStart"  class="pl-1" placeholder="Start of current term"  required value="1/10/2025"/>
    </label>

    <label class="my-2">
        Customer Term End:
        <input name="currentTermEnd" class="pl-1 " placeholder="End of current term"  required value="1/09/2026"/>
    </label>

    <label class="my-2">
        Term Length:
        <input name="termLength" class="pl-1 w-[500px]" placeholder="Term length in months"  required value="12"/>
    </label>

    <!-- <label class="my-2">
        isAutoRenew:
        <input name="isAutoRenew" class="pl-1"/>
    </label> -->

    <!-- <label class="my-2">
        Renewal Price Increase:
        <input name="renewalPriceIncrease"  class="pl-1"/>
    </label> -->
    <button type="submit">Save</button>
</form>

{#if form?.error}
<p>{form?.error}</p>
{/if}
