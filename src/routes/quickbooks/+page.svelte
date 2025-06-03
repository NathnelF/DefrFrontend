<script>
    import Flatpickr from '../../lib/components/Flatpickr.svelte';
    import QbReport from './QBReport.svelte';

    let currentDay = new Date();
    let firstDayOfYear = new Date(currentDay.getFullYear(), 0, 1);

    let startDate = $state(firstDayOfYear.toLocaleDateString('en-CA'));
    let endDate = $state(currentDay.toLocaleDateString('en-CA'));
    let file

    let { form } = $props()
</script>

<div class="flex items-center">
        <Flatpickr id={"start-date"} label="From" bind:value={startDate}/>
        <Flatpickr id={"end-date"} label="To" bind:value={endDate}/>
        <button class="btn px-10 py-5 mt-6.5 ml-3 rounded-md">QB Events</button>
        <form Method="POST" action="?/upload"class="flex flex-col ml-auto w-1/4" enctype="multipart/form-data">
            <label for="file" class="p-1 font-bold ">Choose CSV</label>
            <input 
            type="file"
            id="file"
            name="csvFile"
            accept=".csv"
            class="file-input"/>        
            <button type="submit" class="btn w-26.75 mt-2">Upload</button>
        </form> 
</div>

{#if form?.error}
<p>{form?.error}</p>
{:else if form?.success === false}
<p>Did not succeed: {form?.error}</p>
{:else}
<p>Did succeed! {form?.result}</p>
{/if}



