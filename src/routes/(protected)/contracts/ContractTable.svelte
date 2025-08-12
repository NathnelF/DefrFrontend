<script>
    let {contracts} = $props();
    import { readableDate } from 'root/lib/utils/dateConverter.js'
    import ConfirmModal from '$lib/components/ConfirmModal.svelte';
    import { invalidate } from '$app/navigation';

    let modalRef = $state()
    let selectedId = $state(null)
    let reloadLink

    let sortColumn = $state(' ')
    let sortDirection = $state('asc')


    let sortedContracts = $derived.by(() => {
      if (!sortColumn) return contracts;

      return [...contracts].sort((a,b) => {
        let aValue, bValue

        switch(sortColumn){
          case 'customer':
            aValue = a.customerName.toLowerCase()
            bValue = b.customerName.toLowerCase()
            break;
          case 'service':
            aValue = a.serviceName.toLowerCase()
            bValue = b.serviceName.toLowerCase()
            break;
          case 'amount':
            aValue = a.price
            bValue = b.price
            break;
          case 'termStart':
            aValue = new Date(a.currentTermStart)
            bValue = new Date(b.currentTermStart)
            break;
          case 'termStart':
            aValue = new Date(a.currentTermEnd)
            bValue = new Date(b.currentTermEnd)
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1

      })
    })

    function handleSort(column){
      if (sortColumn === column){
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'
      }
      else {
        sortColumn = column;
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'
      }
    }

    function getSortIndicator(column){
      if (sortColumn !== column) return '↕️'
      return sortDirection === 'asc' ? '⬆️' : '⬇️'
    }

    function displayModal(contractId){
      selectedId = contractId
      modalRef.open()
    }

     async function deleteContract() {
      console.log(`attempt delete on ${selectedId}`)
      const res = await fetch(`https://localhost:7246/delete_contract?contractId=${selectedId}`, {
        method: 'DELETE',
        credentials: 'include'
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

  async function genAllSchedules(){
    const url = "https://localhost:7246/gen_all_schedules"
    try {
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include'
      })

      if (!res.ok) {
        const error = await res.text()
        console.log(`http error: ${error}`)
      } else{
        const message = await res.text()
        console.log(message)
      }
    } catch (error) {
      console.log('Could not fetch url')
    }
  }

  async function clearAllSchedules(){
    const url = "https://localhost:7246/clear_all_schedules"
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!res.ok) {
        const error = await res.text()
        console.log(`http error: ${error}`)
      } else{
        const message = await res.text()
        console.log(message)
      }
    } catch (error) {
      console.log('Could not fetch url')
    }
  }
</script>

<style>
  .sortable-header {
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
  }

  .sortable-header:hover {
    background-color: rgba(0,0,0, 0.05);
  }

  .sort-indicator {
    margin-left: 4px;
    font-size: 0.8em;
    opactity: 0.7;
  }
</style>

<div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
  <div class="flex mb-5">
    <p class="text-2xl font-bold p-3 text-left">NWG Recurring Contracts</p>
    <button class="btn w-1/10 block ml-auto mr-2 mt-3.5" onclick={genAllSchedules}>Gen All Schedules</button>
    <button class="btn mr-2 mt-3.5" onclick={clearAllSchedules}>Clear All Schedules</button>
    <a class="btn mr-10 mt-3.5" href="/contracts/create">Create Contract</a>
  </div>
  <table class="table text-left">
    <thead>
      <tr>
        <th>Contract Id</th>
        <th class="sortable-header" onclick={() => handleSort('customer')}>
          Customer
          <span class="sort-indicator">{getSortIndicator('customer')}</span>
        </th>
        
        <th class="sortable-header" onclick={() => handleSort('service')}>
                  Service
                  <span class="sort-indicator">{getSortIndicator('service')}</span>
                </th>
        <th class="sortable-header" onclick={() => handleSort('price')}>
                  Price
                  <span class="sort-indicator">{getSortIndicator('price')}</span>
                </th>
        <th class="sortable-header" onclick={() => handleSort('termStart')}>
                  Current Term Start
                  <span class="sort-indicator">{getSortIndicator('termStart')}</span>
                </th>
        <th class="sortable-header" onclick={() => handleSort('termEnd')}>
                  Current Term End
                  <span class="sort-indicator">{getSortIndicator('termEnd')}</span>
                </th>
                <th class="text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each sortedContracts as contract, i}
      <tr>
        <th>{contract.id}</th>
        <td>{contract.customerName}</td>
        <td>{contract.serviceName}</td>
        <td>{`${contract.price.toFixed(2)}`}</td>
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
