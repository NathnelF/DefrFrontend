<script>
    import CompareReport from "./CompareReport.svelte"
    import Flatpickr from "$lib/components/Flatpickr.svelte";
    import { disableScrollHandling } from "$app/navigation";
    import { readableDate } from "$lib/utils/dateConverter";
    import Report from "../report/Report.svelte";
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
    let reportModal = $state(null)
    let nwgCustomers = $state(new Map())
    let qbCustomers = $state(new Map())
    let nwgBalance = $state(new Map())
    let qbBalance = $state(new Map())

    async function fetchEvents(){
        const qbUrl = `https://localhost:7246/get_qb_event_range?startDate=${startDate}&endDate=${endDate}`
        const nwgUrl = `https://localhost:7246/report_events?startDate=${startDate}&endDate=${endDate}`

        const [qbRes, nwgRes] = await Promise.all([
            fetch(qbUrl, { credentials: 'include'}),
            fetch(nwgUrl, { credentials: 'include'})
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
            getBalances()
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
        qbCustomers = new Map()
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
                let split = event.lineDescription.split(" ")
                if (split.length === 1){
                    let name = "GT" //hard coded at GT for now because this is the only customer that follows this pattern in Quickbooks
                    let count = qbCustomers.get(name) || 0
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

    function getBalances(){
        nwgBalance = new Map()
        qbBalance = new Map()

        nwgEvents.forEach( (event) => {
            const date = new Date(event.date)
            const dateKey = `${date.toLocaleString('default', { month: 'long' })}, ${date.getFullYear()}`
            let count = nwgBalance.get(dateKey) || null
            if (count) {
                nwgBalance.set(dateKey, count + event.amount)
            } else {
                nwgBalance.set(dateKey, event.amount)
            }
            

        })

        qbEvents.forEach( (event) => {
            const date = new Date(event.date)
            const dateKey = `${date.toLocaleString('default', { month: 'long' })}, ${date.getFullYear()}`
            let count = qbBalance.get(dateKey) || null
            if (count) {
                qbBalance.set(dateKey, count + event.amount)
            } else {
                qbBalance.set(dateKey, event.amount)
            }
        })

        
    }

    function openCount(){
        countModal.showModal()
    }

    function openReport(){
        reportModal.showModal()
    }

    function closeCount(){   
        countModal.close()
    }

    function closeReport(){
        reportModal.close()
    }
</script>

<div class="flex items-center mb-4">
  <Flatpickr id={"start-date"} label="From" bind:value={startDate}/>
  <Flatpickr id={"end-date"} label="To" bind:value={endDate}/>
  <button class="btn mt-6.5 ml-3 px-10 py-5 rounded-md" onclick={fetchEvents}>Get Events</button>
  <button class="btn mt-6.5 ml-3 px-10 py-5 rounded-md" onclick={ openCount }>See counts</button>
  <button class="btn mt-6.5 ml-3 px-10 py-5 rounded-md" onclick={clearEvents}>Clear Events</button>
  <button class="btn mt-6.5 ml-3 px-10 py-5 rounded-md" onclick={ openReport }>Show Balances</button>
  <dialog class="modal" bind:this={countModal}>
    <div class="modal-box w-11/12 max-w-5xl">
        <h3 class="text-lg font-bold">Entry Counts:</h3>
        <h3>{readableDate(startDate)} -- {readableDate(endDate)}</h3>
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
            <button class="btn" onclick={ closeCount }>Close</button>
        </div>
    </div>
  </dialog>
</div>

<dialog class="modal" bind:this={reportModal}>
    <div class="modal-box w-11/12 max-w-5xl">
        <h3 class="text-lg font-bold">Monthly Balances:</h3>
        <p class="py-4">Press Escape or Click the button below to close</p>
        <div class="flex w-full">
            {#if nwgCustomers.size > 0}
            <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-1/2">
                <table class="table">
                    <caption class="text-l font-bold py-2 px-4 w-full">NWG Balances</caption>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Balance</th>
                    </tr>
                    </thead>
                    <tbody>
                        {#each Array.from(nwgBalance.entries()) as [date, balance]}
                        <tr>
                            <td>{date}</td>
                            <td>{balance}</td>
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
                    <caption class="text-l font-bold py-2 px-4 w-full">QB Balances</caption>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Balance</th>
                    </tr>
                    </thead>
                    <tbody>
                        {#each Array.from(qbBalance.entries()) as [date, balance]}
                        <tr>
                            <td>{date}</td>
                            <td>{balance}</td>
                        </tr>
                        {/each}
                    </tbody>
                </table>
                </div>
            {/if}
        </div>
        <div class="modal-action">
            <button class="btn" onclick={ closeReport }>Close</button>
        </div>
    </div>
</dialog>



{#if qbError}
<p>Error getting quickbooks events {qbError}</p>
{:else if nwgError}
<p>Error getting NWG events {nwgError}</p>
{:else if found === true}
<CompareReport {nwgEvents} {qbEvents} />
{:else}
<p>Select a range of dates and click Get Events to search for all recognition events in that range.</p>
{/if}
