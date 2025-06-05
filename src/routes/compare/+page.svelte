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
    let nwgCustomers = $state(new Map())
    let qbCustomers = $state(new Map())

    async function fetchEvents(){
        const qbUrl = `https://localhost:7246/get_qb_event_range?startDate=${startDate}&endDate=${endDate}`
        const nwgUrl = `https://localhost:7246/report_events?startDate=${startDate}&endDate=${endDate}`

        const [qbRes, nwgRes] = await Promise.all([
            fetch(qbUrl),
            fetch(nwgUrl)
        ]);

        qbError = null
        nwgError = null

        if (!qbRes.ok) {
            qbError = await qbRes.text()
            console.log(`qbError: ${qbError}`)
        } else{
            qbEvents = await qbRes.json()
        }

        if (!nwgRes.ok) {
            nwgError = await nwgRes.text()
            console.log(`nwgError: ${nwgError}`)
        } else{
            nwgEvents = await nwgRes.json()
            countNwgCustomers()
            countQbCustomers()
            found = true
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
        nwgCustomers = new Map()
        qbError =null
        nwgError = null
        found = false
    }

    

    function countNwgCustomers(){
        nwgCustomers = new Map();
        nwgEvents.forEach((event) => {
            if (event.amount > 0){
                let split = event.customerInfo.split(" ")
                if (split.length > 2){
                    if (split[1] === 'NWG' || split[1] === 'VMP' || split[1] === 'EH'){
                        let name = `(Invoice for: ${split[0]})`
                        let count = nwgCustomers.get(name) || 0
                        count++
                        nwgCustomers.set(name, count)
                    } else {
                        let name = `(Invoice for: ${split[0]} ${split[1]})`
                        let count = nwgCustomers.get(name) || 0
                        count++
                        nwgCustomers.set(name, count)
                    }
                }
                else{
                    let name = `(Invoice for: ${split[0]})`
                    let count = nwgCustomers.get(name) || 0
                    count++
                    nwgCustomers.set(name, count)
                }
            } 
            else {
                let split = event.customerInfo.split(" ")
                if (split.length > 2){
                    if (split[1] === 'NWG' || split[1] === 'VMP' || split[1] === 'EH'){
                        let name = split[0]
                        let count = nwgCustomers.get(name) || 0
                        count++
                        nwgCustomers.set(name, count)
                    } else {
                        let name = `${split[0]} ${split[1]}`
                        let count = nwgCustomers.get(name) || 0
                        count++
                        nwgCustomers.set(name, count)
                    }
                }
                else{
                    let name = split[0]
                    let count = nwgCustomers.get(name) || 0
                    count++
                    nwgCustomers.set(name, count)
                }
            }
        });
    }

    function countQbCustomers(){
        qbCustomers = new Map()
        qbEvents.forEach((event) => {
            if (!event.isInvoice){
                //console.log(event.lineDescription)
                let split = event.lineDescription.split(" ")
                //console.log(split)
                if (split.length === 1){
                    let name = "GT" //hard coded at GT for now because this is the only customer that follows this pattern in Quickbooks
                    let count = qbCustomers.get(name) || 0 //get's count or set to zero if can't be found
                    count++
                    qbCustomers.set(name, count)
                }
                else if (split.length === 2){
                    let name = split[0]
                    let count = qbCustomers.get(name) || 0
                    count++
                    qbCustomers.set(name, count)
                }
                else {
                    if (split[1] === 'NWG' || split[1] === 'VMP' || split[1] === 'EH'){
                        let name = split[0]
                        let count = qbCustomers.get(name) || 0
                        count++
                        qbCustomers.set(name, count)
                    } else {
                        let name = `${split[0]} ${split[1]}`
                        let count = qbCustomers.get(name) || 0
                        count++
                        qbCustomers.set(name, count)
                    }
                }
            }
            else{
                let name = `(Invoice for: ${event.name})`
                let count = qbCustomers.get(name) || 0
                count++
                qbCustomers.set(name, count)

            }
        })

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
  <button class="btn mt-6.5 ml-3 px-10 py-5 rounded-md" onclick={ open }>See counts</button>
  <button class="btn mt-6.5 ml-3 px-10 py-5 rounded-md" onclick={clearEvents}>Clear Events</button>
  <dialog class="modal" bind:this={countModal}>
    <div class="modal-box w-11/12 max-w-5xl">
        <h3 class="text-lg font-bold">Entry Counts</h3>
        <p class="py-4">Press Escape or Click the button below to close</p>
        <div class="flex w-full">
            {#if nwgCustomers.size > 0}
            <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-1/2">
                <table class="table">
                    <caption class="text-l font-bold py-2 px-4 w-full">NWG Customer Counts</caption>
                    <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Count</th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each Array.from(nwgCustomers.entries()).sort((a,b) => a[0].localeCompare(b[0])) as [key,value]}
                    <tr>
                        <td>{key}</td>
                        <td>{value}</td>
                    </tr>
                    {/each}
                    </tbody>
                </table>
                </div>
            {/if}
            <div class="divider divider-horizontal"></div>
            {#if qbCustomers.size > 0}
            <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-1/2">
                <table class="table">
                    <caption class="text-l font-bold py-2 px-4 w-full">QB Customer Counts</caption>
                    <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Count</th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each Array.from(qbCustomers.entries()).sort((a, b) => a[0].localeCompare(b[0])) as [key,value]}
                    <tr>
                        <td>{key}</td>
                        <td>{value}</td>
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
