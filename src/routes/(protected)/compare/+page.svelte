<script>
    import CompareReport from "./CompareReport.svelte"
    import Flatpickr from "$lib/components/Flatpickr.svelte";
    import { disableScrollHandling } from "$app/navigation";
    import { readableDate } from "$lib/utils/dateConverter";
    import { USDollar } from "$lib/utils/currencyFormat";
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

    let startingBalance = $state(1000)
    let monthlyBalances = $state([])
    let balanceModal = $state(null)

    function nextMonth(date){
      let copyDate = new Date(date)
      copyDate.setDate(1)
      copyDate.setMonth(date.getMonth() + 1)

       return copyDate
    }

     function getApplicableMonths(start, end){
            let begin = new Date(start.replaceAll('-', '/'))
            console.log('begin', begin)
            let done = new Date(end.replaceAll('-', '/'))
            console.log('end', done)

            let validMonths = []

            let month = new Date(begin)
            validMonths.push(month)
            console.log('first push', month)
            while (month < done){
                let temp = new Date(month)
                temp = nextMonth(month)
                if (temp >= done){
                  break;
                }
                month = temp
                validMonths.push(month)
                console.log('pushed: ', month)
            }

            for (let i = 0; i < validMonths.length; i++){
                validMonths[i] = validMonths[i].toLocaleDateString('en-CA', {
                  year: 'numeric',
                  month: 'long'
                })
            }

            return validMonths
        }

    function getMonthlyBalances() {
        const months = getApplicableMonths(startDate, endDate)
        console.log(months)

        const monthlyData = months.map((monthName, index) => {
            const monthIndex = index + 1

            const nwgMonthEvents = nwgEvents.filter(event => {
                const eventDate = new Date(event.date)
                return eventDate.getMonth() + 1 === monthIndex // && year matches 
            })

            const qbMonthEvents = qbEvents.filter(event => {
                const eventDate = new Date(event.date)
                return eventDate.getMonth() + 1 === monthIndex // && year matches
            })

            let nwgSum = 0
            nwgMonthEvents.forEach(event => {
                nwgSum += (event.amount || 0)
            })            

            let qbSum = 0
            qbMonthEvents.forEach((event) => {
                qbSum += (event.amount || 0)
            })

            return {
                month: monthName,
                nwgChange: nwgSum,
                qbChange: qbSum
            }

        })

        console.log(monthlyData)

        let nwgRunningBalance = startingBalance
        let qbRunningBalance = startingBalance

        return monthlyData.map(monthData => {
            nwgRunningBalance += monthData.nwgChange
            qbRunningBalance += monthData.qbChange

            return {
                ...monthData,
                nwgBalance: nwgRunningBalance,
                qbBalance: qbRunningBalance,
                difference: nwgRunningBalance - qbRunningBalance
            }
        })
        
    }

    function openBalanceModal(){
        balanceModal.showModal()
    }

    function closeBalanceModal(){
        balanceModal.close()
    }

    

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
            found = true
        }

        if (qbError === null && nwgError === null){
            monthlyBalances = getMonthlyBalances()
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
        monthlyBalances = []
    }

    

</script>

<div class="flex items-center mb-4">
  <Flatpickr id={"start-date"} label="From" bind:value={startDate}/>
  <Flatpickr id={"end-date"} label="To" bind:value={endDate}/>
  <input class="input mt-6.5 ml-3 py-5 rounded-md" type="number" bind:value={startingBalance}/>
  <button class="btn mt-6.5 ml-3 px-10 py-5 rounded-md" onclick={fetchEvents}>Get Events</button>
  <button class="btn mt-6.5 ml-3 px-10 py-5 rounded-md" onclick={clearEvents}>Clear Events</button>
  <button class="btn mt-6.5 ml-3 px-10 py-5 rounded-md" onclick={openBalanceModal}>Monthly Balances</button>
</div>

<dialog class="modal" bind:this={balanceModal}>
    <div class="modal-box w-11/12 max-w-4xl">
        <table class="table text-left">
        <caption>{startingBalance}</caption>
            <thead>
                <tr>
                    <th>Month</th>
                    <th>NWG Balance</th>
                    <th>QB Balance</th>
                    <th>Difference</th>
                </tr>
            </thead>
            <tbody>
                {#each monthlyBalances as monthly}
                    <tr>
                        <td>{monthly.month}</td>
                        <td>{`${USDollar.format(monthly.nwgBalance)}`}</td>
                        <td>{`${USDollar.format(monthly.qbBalance)}`}</td>
                        <td>{`${USDollar.format(monthly.difference)}`}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
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
