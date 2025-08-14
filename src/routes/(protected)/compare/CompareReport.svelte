<script> 
    let { nwgEvents, qbEvents } = $props();
    import { readableDate } from "$lib/utils/dateConverter";


    let sortNwgColumn = $state(' ')
    let sortNwgDirection = $state('asc')
    let sortQbColumn = $state(' ')
    let sortQbDirection = $state('asc')

    let sortedNwgEvents = $derived.by(() => {
        if (!sortNwgColumn) return nwgEvents

        return [...nwgEvents].sort((a,b) => {
            let aValue, bValue

            switch (sortNwgColumn){
                case 'date':
                    aValue = new Date(a.date)
                    bValue = new Date(b.date)
                    break
                case 'contract':
                    aValue = a.customerInfo
                    bValue = b.customerInfo
                    break
                case 'balance':
                    aValue = a.amount
                    bValue = b.amount
                    break
                default:
                    return 0
            }

            if (aValue < bValue) return sortNwgDirection === 'asc' ? -1 : 1
            if (aValue > bValue) return sortNwgDirection === 'asc' ? 1 : -1
        })
    })
     function handleSortNwg(column){
       if (sortNwgColumn === column){
         sortNwgDirection = sortNwgDirection === 'asc' ? 'desc' : 'asc'
       } else {
         sortNwgColumn = column
         sortNwgDirection = sortNwgDirection === 'asc' ? 'desc' : 'asc'
       }
     }

    function getSortIndicatorNwg(column){
      if (sortNwgColumn  !== column) return '↕️'
      return sortNwgDirection === 'asc' ? '⬆️' : '⬇️'
    }

        let sortedQbEvents = $derived.by(() => {
        if (!sortQbColumn) return qbEvents

        return [...qbEvents].sort((a,b) => {
            let aValue, bValue

            switch(sortQbColumn){
                case 'date':
                    aValue = new Date(a.date)
                    bValue = new Date(b.date)
                    break
                case 'lineDescription':
                    aValue = a.lineDescription
                    bValue = b.lineDescription
                    break
                case 'name':
                    aValue = a.name
                    bValue = b.name
                    break
                case 'amount':
                    aValue = a.amount
                    bValue = b.amount
                    break
                default:
                    return 0
            }

            if (aValue < bValue) return sortQbDirection === 'asc' ? -1 : 1
            if (aValue > bValue) return sortQbDirection === 'asc' ? 1 : -1
        })
    })
     function handleSortQb(column){
       if (sortQbColumn === column){
         sortQbDirection = sortQbDirection === 'asc' ? 'desc' : 'asc'
       } else {
         sortQbColumn = column
         sortQbDirection = sortQbDirection === 'asc' ? 'desc' : 'asc'
       }
     }

    function getSortIndicatorQb(column){
      if (sortQbColumn  !== column) return '↕️'
      return sortQbDirection === 'asc' ? '⬆️' : '⬇️'
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

<div class="flex w-full">
    <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 ml-5 w-1/2">
    <table class="table text-left">
        <caption class="text-2xl font-bold px-20 text-center">NWG Recogntion Report</caption>
        <thead>
        <tr>
         <th class="sortable-header" onclick={() => handleSortNwg('date')}>
          Date
          <span class="sort-indicator">{getSortIndicatorNwg('date')}</span>
        </th>
        <th class="sortable-header" onclick={() => handleSortNwg('contract')}>
          Contract
          <span class="sort-indicator">{getSortIndicatorNwg('contract')}</span>
        </th>
        <th class="sortable-header" onclick={() => handleSortNwg('balance')}>
          Balance
          <span class="sort-indicator">{getSortIndicatorNwg('balance')}</span>
        </th>
        </tr>
        </thead>
        <tbody>
        {#each sortedNwgEvents as event}
        <tr>
            <td>{readableDate(event.date)}</td>
            <td>{event.customerInfo}</td>
            <td>{event.amount.toFixed(2)}</td>
            <td></td>
        </tr>
        {/each}
        </tbody>
    </table>
    </div>
    <div class="divider divider-horizontal"></div>
    <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-1/2">
    <table class="table text-left ml-3.5 px-1">
        <caption class="text-2xl font-bold p-3 text-center px-20">Quickbooks Recogntion Report</caption>
        <thead>
        <tr>
             <th class="sortable-header" onclick={() => handleSortQb('date')}>
          QB Date
          <span class="sort-indicator">{getSortIndicatorQb('date')}</span>
        </th>
        <th class="sortable-header" onclick={() => handleSortQb('lineDescription')}>
          QB Line Description
          <span class="sort-indicator">{getSortIndicatorQb('lineDescription')}</span>
        </th>
        <th class="sortable-header" onclick={() => handleSortQb('name')}>
          QB Name
          <span class="sort-indicator">{getSortIndicatorQb('name')}</span>
        </th>
        <th class="sortable-header" onclick={() => handleSortQb('amount')}>
          QB Amount
          <span class="sort-indicator">{getSortIndicatorQb('amount')}</span>
        </th>
        </tr>
        </thead>
        <tbody>
        {#each sortedQbEvents as qbevent}
        <tr>
            <td>{readableDate(qbevent.date)}</td>
            <td>{qbevent.lineDescription}</td>
            <td>{qbevent.name}</td>
            <td>{qbevent.amount.toFixed(2)}</td>
            <td></td>
        </tr>
        {/each}
        </tbody>
    </table>
    </div>
</div>
