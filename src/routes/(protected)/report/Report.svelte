<script> 
    let { events } = $props();
    import { readableDate } from "$lib/utils/dateConverter";

    let sortColumn= $state(' ')
    let sortDirection = $state('asc')

    let sortedEvents = $derived.by(() => {
      if (!sortColumn) return events;

      return [...events].sort((a,b) => {
        let aValue, bValue

        switch (sortColumn){
          case 'date':
            aValue = new Date(a.date)
            bValue = new Date(b.date)
            break
          case 'contract':
            aValue = a.customerInfo.toLowerCase()
            bValue = b.customerInfo.toLowerCase()
            break
          case 'balance':
            aValue = a.amount
            bValue = b.amount
            break
          default:
            return 0
          }
          
          if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
          if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1

        
      })
     })

     function handleSort(column){
       if (sortColumn === column){
         sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'
       } else {
         sortColumn = column
         sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'
       }
     }

    function getSortIndicator(column){
      if (sortColumn !== column) return '↕️'
      return sortDirection === 'asc' ? '⬆️' : '⬇️'
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
  <table class="table text-left">
    <caption class="text-2xl font-bold p-3 text-left">Revenue Recogntion Report</caption>
    <thead>
      <tr>
        <th class="sortable-header" onclick={() => handleSort('date')}>
          Date
          <span class="sort-indicator">{getSortIndicator('date')}</span>
        </th>
        <th class="sortable-header" onclick={() => handleSort('contract')}>
          Contract
          <span class="sort-indicator">{getSortIndicator('contract')}</span>
        </th>
        <th class="sortable-header" onclick={() => handleSort('balance')}>
          Balance
          <span class="sort-indicator">{getSortIndicator('balance')}</span>
        </th>
      </tr>
    </thead>
    <tbody>
      {#each sortedEvents as event}
      <tr>
        <td>{readableDate(event.date)}</td>
        <td>{event.customerInfo}</td>
        <td>{event.amount.toFixed(2)}</td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>
