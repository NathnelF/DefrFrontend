<script>
    import InvoiceDate from './InvoiceDate.svelte';
    import Schedule from './Schedule.svelte'
    import { page } from '$app/stores'
    import Flatpickr from "$lib/components/Flatpickr.svelte";

    let { data } = $props();
    let { error } = data;
    let found = $state(data.found)
    let events = $state(data.events)
    let invoiceDate = $state(data.date)
    let genError = null
    let delError = null
    let updateInvoiceError = null
    let dateInfo
    let amountInfo
    const id = $page.params.id;
    const dateExists = data.date
    let reloadLink;

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

    async function newDateUpdateAmount(){
      const dateUrl = `https://localhost:7246/update_invoice_date?contractId=${id}`
      const amountUrl = `https://localhost:7246/update_schedule_invoice_amount?Id=${id}`

      
      const dateRes = await fetch(dateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          invoiceDate: invoiceDate
      })
      })

      if (!dateRes.ok){
        updateInvoiceError = await dateRes.text()
        console.log(`failed on date update: ${updateInvoiceError}`)
        return updateInvoiceError

      } else {
        dateInfo = await dateRes.json()
        console.log(`successful date update: ${dateInfo}`)
      }

      const amountRes = await fetch(amountUrl, {
        method: 'PUT'
      })

      if (!amountRes.ok){
        updateInvoiceError = await amountRes.text()
        console.log(`failed on amount update: ${updateInvoiceError}`)
        return updateInvoiceError

      } else {
        amountInfo = await amountRes.json()
        console.log(`successful amount update: ${amountInfo}`)
        reloadLink.click()
        return amountInfo
      }
    }

    async function updateAmount(){
      try{
        const amountUrl = `https://localhost:7246/update_schedule_invoice_amount?Id=${id}`
        const res = await fetch(amountUrl, {
          method: 'PUT'
        })

        if (!res.ok){
          console.log(`error on endpoint ${res.status}`)
        } else{
          const info = await res.json()
          console.log(`success on endpoint`
          )
          reloadLink.click()
          return;
        }

        
      } catch (error)
      {
        console.log(`error on update invoice ${error.message}`)
      }
      
    }

    async function clearInvoiceDate(){
      try{
        const res = await fetch(`https://localhost:7246/reset_invoice_date?contractId=${id}`, {
          method: 'PUT'
        })
        if (!res.ok) {
          console.log('could not reset invocie date')
        } else{
          console.log('reset invoice date')
          invoiceDate = null
          reloadLink.click()
        }
      } catch (error) {
        console.log(error)
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
<button class="btn mt-6 ml-4" onclick={newDateUpdateAmount}>New Date</button>
{:else}
<button class="btn mt-6 ml-4" onclick={updateInvoiceDate}>Update Date</button>
{/if}
</div>
<button class='btn' onclick={clearSchedule}>Clear Schedule</button>
<button class='btn' onclick={updateAmount }>Update Invoice Amount</button>
<button class='btn' onclick={clearInvoiceDate}>Clear Invoice Date</button>
<Schedule events={events} contractName="Test Customer Test Service"/>
{/if}
<a href="/contracts/{id}/schedule"  data-sveltekit-reload class="hidden" bind:this={reloadLink}>Reload</a>

