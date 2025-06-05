<script>
    import Flatpickr from '../../lib/components/Flatpickr.svelte';
    import QbReport from './QBReport.svelte';

    let currentDay = new Date();
    let firstDayOfYear = new Date(currentDay.getFullYear(), 0, 1);

    let startDate = $state(firstDayOfYear.toLocaleDateString('en-CA'));
    let endDate = $state(currentDay.toLocaleDateString('en-CA'));
    let file

    let { form } = $props()

    let loadError = $state(null)
    let clearError = $state(null)
    let found = $state(false)
    let events = $state([])
    let showFormMessage = $state(true)


    async function getEventsByDate(){
     const url = `https://localhost:7246/get_qb_event_range?startDate=${startDate}&endDate=${endDate}`
     loadError = null
     try{
        const res = await fetch(url)
        if (!res.ok) {
            loadError = await res.text()
            console.log(`Error on request: ${loadError}`)
        }
        else {
            events = await res.json()
            found = true
        }

     }  catch (error) {
        loadError = error.message
        console.log(`Cound't fetch events ${loadError}`)
     }
     showFormMessage = false;
     
     return (
        loadError,
        found,
        events
     )
    }

    function clearEvents(){
        found = false;
        events = []
        showFormMessage = false;
        loadError = null
    }

    async function resetAllEvents(){
     try{
        const res = await fetch("https://localhost:7246/clear_qb_events", {
            method: 'DELETE'
        })
        if (!res.ok) {
            clearError = await res.text()
            console.log(`Error resetting events ${clearError}`)
        }
        else{
            events = []
            found = false
            clearError = null
            loadError = null
        }
     } catch (error) {

        clearError = error.message
        console.log(`Error resetting events ${clearError}`)
     }

     showFormMessage = false;
     
     return (
        events,
        found,
        clearError
     )
    }
</script>


<div class="flex items-center">
        <Flatpickr id={"start-date"} label="From" bind:value={startDate}/>
        <Flatpickr id={"end-date"} label="To" bind:value={endDate}/>
        <button class="btn px-10 py-5 mt-6.5 ml-3 rounded-md" onclick={getEventsByDate}>QB Events</button>
        <button class="btn mt-6.5 ml-1.5" onclick={clearEvents}>Clear current events</button>
        {#if found === true}
            <button class="btn mt-6.5 ml-auto" onclick={resetAllEvents}>Reset all events</button>
        {:else}
        <form Method="POST" action="?/upload"class="flex flex-col ml-auto w-1/4" enctype="multipart/form-data">
            <label for="file" class="p-1 font-black ">Upload via CSV.</label>
            <input 
            type="file"
            id="file"
            name="csvFile"
            accept=".csv"
            class="file-input"/>        
            <button type="submit" class="btn w-26.75 mt-2">Upload</button>
        </form> 
        {/if}
        {#if form?.error}
        <p>{form?.error}</p>
        {:else if form?.success === false && showFormMessage === true}
        <p>Form submit did not succeed: {form?.error}</p>
        {:else if form?.success === true && showFormMessage === true}
        <p>Success: {form?.result}</p>
        {/if} 
</div>

<div>
{#if loadError}
<p>Error generating events: {loadError}</p>
{:else if found === false}
<p>Try generating events</p>
{:else if events.length === 0}
<p>Could not find events for that range</p>
{:else if events && events.length > 0 && !clearError}
<QbReport {events} />
{:else}
<p>Error reseting events {clearError}</p>
{/if}
</div>
    






