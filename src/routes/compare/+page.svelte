<script>
    import CompareReport from "./CompareReport.svelte"
    import Flatpickr from "$lib/components/Flatpickr.svelte";
    import { disableScrollHandling } from "$app/navigation";
    let currentDay = new Date();
    let firstDayOfYear = new Date(currentDay.getFullYear(), 0, 1);

    let startDate = $state(firstDayOfYear.toLocaleDateString('en-CA'))
    let endDate = $state(currentDay.toLocaleDateString('en-CA'))
    let nwgEvents = $state([])
    let qbEvents = $state([])
    let nwgError = $state(null)
    let qbError = $state(null)
    let found = $state(false)
    let countModal = $state(null)

    async function fetchEvents(){
        const qbUrl = `https://localhost:7246/get_qb_event_range?startDate=${startDate}&endDate=${endDate}`
        const nwgUrl = `https://localhost:7246/report_events?startDate=${startDate}&endDate=${endDate}`

        const [qbRes, nwgRes] = await Promise.all([
            fetch(qbUrl),
            fetch(nwgUrl)
        ]);

        if (!qbRes.ok) {
            qbError = await qbRes.text()
            console.log(`qbError: ${qbError}`)
        } else{
            qbEvents = await qbRes.json()
            console.log(`${qbEvents[0]}`)
        }

        if (!nwgRes.ok) {
            nwgError = await nwgRes.text()
            console.log(`nwgError: ${nwgError}`)
        } else{
            nwgEvents = await nwgRes.json()
            found = true
            console.log(`${nwgEvents[0]}`)
        }

        return (
            qbError,
            nwgError,
            qbEvents,
            nwgEvents,
            found
        )
    }

    function clearEvents(){
        nwgEvents = []
        qbEvents = []
        qbError =null
        nwgError = null
        found = false
    }

    function open(){
        countModal.showModal()
    }

    function close(){
        countModal.close()
    }
</script>

<div class="flex items-center mb-4">
  <Flatpickr id={"start-date"} label="From" bind:value={startDate}/>
  <Flatpickr id={"end-date"} label="To" bind:value={endDate}/>
  <button class="btn mt-6.5 ml-3 px-10 py-5 rounded-md" onclick={fetchEvents}>Get Events</button>
  <button class="btn mt-6.5 ml-3 px-10 py-5 rounded-md" onclick={clearEvents}>Clear Events</button>
  <button class="btn mt-6.5 ml-3 px-10 py-5 rounded-md" onclick={ open }>See counts</button>
  <dialog class="modal" bind:this={countModal}>
    <div class="modal-box w-11/12 max-w-5xl">
        <h3 class="text-lg font-bold">Hello!</h3>
        <p class="py-4">Click the button below to close</p>
        <div class="flex w-full">
            {#if nwgEvents.length > 0}
            <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table class="table">
                    <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Count</th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each nwgEvents as nwgEvent}
                    <tr>
                        <th>{nwgEvent.customerInfo}</th>
                        <td>{nwgEvent.amount}</td>
                    </tr>
                    {/each}
                    </tbody>
                </table>
                </div>
                {/if}
            <div class="divider divider-horizontal"></div>
            {#if qbEvents.length > 0}
            <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table class="table">
                    <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Count</th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each qbEvents as qbEvent}
                    <tr>
                        <th>{qbEvent.customerInfo}</th>
                        <td>{qbEvent.amount}</td>
                    </tr>
                    {/each}
                    </tbody>
                </table>
                </div>
                {/if}
        </div>
        <div class="modal-action">
            <button class="btn" onclick={ close }>Close</button>
        </div>
    </div>
  </dialog>
</div>


{#if qbError}
<p>Error getting quickbooks events {qbError}</p>
{:else if nwgError}
<p>Error getting NWG events {nwgError}</p>
{:else if found === true}
<CompareReport {nwgEvents} {qbEvents} />
{:else}
<p>Select a range of dates and click Get Events to search for all recognition events in that range.</p>
{/if}
