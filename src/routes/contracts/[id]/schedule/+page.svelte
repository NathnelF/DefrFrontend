<script>
    import InvoiceDate from './InvoiceDate.svelte';
    import Schedule from './Schedule.svelte'
    import { page } from '$app/stores'
    import Flatpickr from "$lib/components/Flatpickr.svelte";

    let { data } = $props();
    let { error} = data;
    let found = $state(data.found)
    let events = $state(data.events)
    let invoiceDate = $state(data.date)
    let genError = null
    let delError = null
    let updateInvoiceError = null
    const id = $page.params.id;
    console.log(`invoice Date for contract ${id}: ${invoiceDate}`)
    let dateExists = $state(false)
    if (invoiceDate != null){
        dateExists = true
    }


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
        delError = "Could not reach endpoint (clear_schedule)"
      }
    }

    async function updateInvoiceDate() {
      try {
        console.log("attempt to update invoice date:", invoiceDate);

        const res = await fetch(`https://localhost:7246/update_invoice_date?contractId=${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            invoiceDate: invoiceDate
          })
        });

        if (!res.ok) {
          updateInvoiceError = await res.json();
          console.log(updateInvoiceError);
          return;
        }

        const info = await res.json()
        console.log("Response body:", info);

        if (info && info.invoiceDate) {
          invoiceDate = info.invoiceDate;
          console.log("Invoice date updated to:", invoiceDate);
        }

      } catch (error) {
        updateInvoiceError = `Could not reach endpoint: ${error.message}`;
        console.log(updateInvoiceError);
      }
    }




</script>



{#if error}
<p class="text-2xl font-bold p-3 text-left">Can't load data. Check database conenction.</p>
{:else if !found || events.length === 0}
<span>No schedule for contract: {id}</span>
<button class='btn' onclick={generateSchedule}>Generate Schedule</button>
{:else}
<div class="flex items-center">
<Flatpickr id={"invoice-date"} label="Invoice Date" bind:value={invoiceDate} />
{#if !dateExists}
<button class="btn mt-6 ml-4">New Date</button>
{:else}
<button class="btn mt-6 ml-4" onclick={updateInvoiceDate}>Update Date</button>
{/if}
</div>
<button class='btn' onclick={clearSchedule}>Clear Schedule</button>
<Schedule events={events} contractName="Test Customer Test Service"/>
{/if}


