<script>
    import CompareReport from "./CompareReport.svelte"
    import Flatpickr from "$lib/components/Flatpickr.svelte";
    let currentDay = new Date();
    let firstDayOfYear = new Date(currentDay.getFullYear(), 0, 1);

    let startDate = $state(firstDayOfYear.toLocaleDateString('en-CA'))
    let endDate = $state(currentDay.toLocaleDateString('en-CA'))
    let nwgEvents = $state([])
    let qbEvents = $state([])
    let nwgError = $state(null)
    let qbError = $state(null)
    let found = $state(false)

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
</script>

<div class="flex items-center mb-4">
  <Flatpickr id={"start-date"} label="From" bind:value={startDate}/>
  <Flatpickr id={"end-date"} label="To" bind:value={endDate}/>
  <button class="btn mt-6.5 ml-3 px-10 py-5 rounded-md" onclick={fetchEvents}>Get Events</button>
  <button class="btn mt-6.5 ml-3 px-10 py-5 rounded-md" onclick={clearEvents}>Clear Events</button>
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
