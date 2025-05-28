<script>
    let {contracts, names} = $props();
    import { readableDate } from '../../lib/utils/dateConverter.js'
    import ConfirmModal from '$lib/components/ConfirmModal.svelte';
    import { invalidate } from '$app/navigation';

    let modalRef = $state()
    let selectedId = $state(null)
    let reloadLink

    function displayModal(contractId){
      selectedId = contractId
      modalRef.open()
    }

     async function deleteContract() {
      console.log(`attempt delete on ${selectedId}`)
      const res = await fetch(`https://localhost:7246/delete_contract?contractId=${selectedId}`, {
        method: 'DELETE'
      })
      if (!res.ok){
        const deleteError = await res.text()
        console.log(deleteError)
        modalRef.close()
        
      }
      else{
        const deleteSuccess = await res.text()
        console.log(deleteSuccess)
        modalRef.close()
        reloadLink.click();
      
    }
  }
</script>

<div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
  <table class="table text-left">
    <caption class="text-2xl font-bold p-3 text-left">NWG Recurring Contracts</caption>
    <thead>
      <tr>
        <th>Contract Id</th>
        <th>Customer</th>
        <th>Service</th>
        <th>Annual Amount</th>
        <th>Current Term Start</th>
        <th>Current Term End</th>
        <th class="text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each contracts as contract, i}
      <tr>
        <th>{contract.id}</th>
        <td>{names.customerName}</td>
        <td>{names.serviceName}</td>
        <td>{contract.price}</td>
        <td>{readableDate(contract.currentTermStart)}</td>
        <td>{readableDate(contract.currentTermEnd)}</td>
        <td class="text-center">
            <a class="btn outline text-s" href="contracts/{contract.id}/schedule">Schedule</a>
            <a class="btn btn-ghost text-s" href="contracts/{contract.id}/edit">Edit</a>
            <button class="btn" onclick={() => displayModal(contract.id)}>Delete</button>
        </td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>

<ConfirmModal bind:this={modalRef} {deleteContract}/>
<a href='/contracts' data-sveltekit-reload class="hidden" bind:this={reloadLink}>reload</a>
