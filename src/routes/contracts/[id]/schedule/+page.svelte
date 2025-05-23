<script>
    import InvoiceDate from './InvoiceDate.svelte';
    import Schedule from './Schedule.svelte'
    import { page } from '$app/stores'

    let { data } = $props();
    let { error} = data;
    let found = $state(data.found)
    let events = $state(data.events)
    let genError = ''
    let delError = ''
    const id = $page.params.id;


    async function generateSchedule(){
      try {

        const res = await fetch(`https://localhost:7246/gen_schedule?contractId=${id}`,
          {
            method: 'POST'
          }
        );
        if (!res.ok) {
          genError = `could not generate schedule: ${res.status}`;

        }
        else{
          events = await res.json();
          found = true;
        }
        

        if (!events || events.length === 0){
          genError = "generated empty schedule"
        }

      } catch (error) {
        genError = error.message;
      }
    }

    async function clearSchedule(){
      try{
        const res = await fetch(`https://localhost:7246/clear_schedule?contractId=${id}`, 
          {
            method: 'DELETE'
          }
        );
        if (!res.ok) {
          delError = "Could not clear schedule"
        }
        else{
          found = false;
          events = []
        }

      } catch (error) {
        delError = "Could reach endpoint (clear_schedule)"
      }
    }



</script>



{#if error}
<p class="text-2xl font-bold p-3 text-left">Can't load data. Check database conenction.</p>
{:else if !found || events.length === 0}
<span>No schedule for contract: {id}</span>
<button class='btn' onclick={generateSchedule}>Generate Schedule</button>
{:else}
<InvoiceDate />
<button class='btn' onclick={clearSchedule}>Clear Schedule</button>
<Schedule events={events} contractName="Test Customer Test Service"/>
{/if}


