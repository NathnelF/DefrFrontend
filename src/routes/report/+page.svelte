<script>
    import Flatpickr from '../../lib/components/Flatpickr.svelte';
    import Report from './Report.svelte'
    let currentDay = new Date();
    let firstDayOfYear = new Date(currentDay.getFullYear(), 0, 1);

    let startDate = $state(firstDayOfYear.toLocaleDateString('en-CA'))
    let endDate = $state(currentDay.toLocaleDateString('en-CA'))

    let loadError = $state(null)
    let found = $state(false)
    let events = $state([])

    async function loadEventsByDate(){
      const url = `https://localhost:7246/report_events?startDate=${startDate}&endDate=${endDate}`
      loadError = null
      try {
        console.log('attempting to load events')
        const res = await fetch(url)
        if (!res.ok) {
          loadError = await res.text()
          console.log(loadError)
        }
        else {
          found = true
          events = await res.json()
          console.log('found events')
        }

      } catch (error) {
        loadError = error.message
        console.log(loadError)
      }

      return (
        loadError,
        found,
        events
      )
    }

    function clearEvents(){
      events = []
      found = false
      loadError = null
    }

</script>

<div class="flex items-center mb-4">
  <Flatpickr id={"start-date"} label="From" bind:value={startDate}/>
  <Flatpickr id={"end-date"} label="To" bind:value={endDate}/>
  <button class="btn mt-6.5 ml-3 px-10 py-5 rounded-md" onclick={loadEventsByDate}>Events</button>
  <button class="btn mt-6.5 ml-3 px-10 py-5 rounded-md" onclick={clearEvents}>Clear Events</button>
</div>

{#if loadError}
<p>error: {loadError}</p>
{:else if found === false}
<p>Click Events to load Events in specified range</p>
{:else}
<Report bind:events={events} />
{/if}

