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

    //diff functionality
    //
    function normalizeContractName(name){
      if (!name) return ' '

      //add name -> invoicer maps.

      return name.trim().toLowerCase()
      .replace(/\s+/g, ' ')
      .replace (/\(invoice for:\s*/gi, '')
      .replace(/\)/g, '')
      .replace(/\(/g, '')
      .replace(/-/g, ' ')
      .trim()

      
    }

    function findMatchingEvents() {
      console.log('hello from find matching events')
      const matches = new Map()
      const nwgOnly = []
      const qbOnly = []
      const amountMismatches = []

      const nwgEventsMap = new Map()
      const qbEventsMap = new Map()

      console.log('=== DEBUGGING ===')
      console.log(nwgEvents.slice(0,3))
      console.log(qbEvents.slice(0,3))

      nwgEvents.forEach((event, index) => {
        const normalizedName = normalizeContractName(event.customerInfo)
        const strippedDate = new Date(event.date)
        const normalizedDate = `${strippedDate.getFullYear()}-${String(strippedDate.getMonth()+1).padStart(2, '0')}`
        const key = `${normalizedDate}_${normalizedName}`

        if (index < 3){
          console.log(`NWG ${index}: "${event.customerInfo}" --> ${normalizedName} --> key: "${key}"`)
        }

        if (!nwgEventsMap.has(key)){
          nwgEventsMap.set(key, [])
        }
        nwgEventsMap.get(key).push({...event, originalIndex: index })
      })

      qbEvents.forEach((event, index) => {
        let comparisonName = ''

        if (event.isInvoice && event.name){
          comparisonName = `(invoice for: ${event.name})`
                }

        else if (event.lineDescription){
          comparisonName = event.lineDescription
        }

        const normalizedName = normalizeContractName(comparisonName)
        const strippedDate = new Date(event.date)
        const normalizedDate = `${strippedDate.getFullYear()}-${String(strippedDate.getMonth()+1).padStart(2, '0')}`
        const key = `${normalizedDate}_${normalizedName}`


        if (index < 3){
          console.log(`QB${index}: "${event.name} or "${event.lineDescription}" --> ${normalizedName} --> "${key}"`)
        }

        if (!qbEventsMap.has(key)){
          qbEventsMap.set(key, [])
        }

        qbEventsMap.get(key).push({...event, originalIndex: index, comparisonName })
        

      })

      const processedNwgKeys = new Set()
      const processedQbKeys = new Set()

      //check for matches
      for (const [key, nwgEventsList] of nwgEventsMap) {
        if (qbEventsMap.has(key)){
          const qbEventsList = qbEventsMap.get(key)

          nwgEventsList.forEach(nwgEvent => {
            const matchingQbEvent = qbEventsList.find(qbEvent => 
              Math.abs(Math.abs(nwgEvent.amount) - Math.abs(qbEvent.amount)) < 0.01
            )

            if (matchingQbEvent){
              console.log('match found:',  matchingQbEvent.originalIndex)
              console.log('NWG event: ', nwgEvent)
              console.log('original index: ', nwgEvent.originalIndex)
              matches.set(nwgEvent.originalIndex, matchingQbEvent.originalIndex)
              console.log(Array.from(matches.entries()))
              processedNwgKeys.add(key)
              processedQbKeys.add(key)
            } else {
              console.log("no matching event found : ", nwgEvent.originalIndex)
              const closestQbEvent = qbEventsList[0]
              amountMismatches.push({
                nwgEvent,
                qbEvent: closestQbEvent ,
                nwgIndex: nwgEvent.originalIndex,
                qbIndex: closestQbEvent .originalIndex
              })
              processedNwgKeys.add(key)
              processedQbKeys.add(key)
            }
          })
        }
      }

      for (const [key, nwgEventsList] of nwgEventsMap){
        if (!processedNwgKeys.has(key)){
          nwgEventsList.forEach(event => {
            nwgOnly.push(event.originalIndex)
          })
        }
      }

      for (const [key, qbEventsList] of qbEventsMap){
        if (!processedQbKeys.has(key)){
          qbEventsList.forEach(event => {
            qbOnly.push(event.originalIndex)
          })
        }
      }

      console.log('NWG Event Map Keys:', Array.from(nwgEventsMap.keys()).slice(0,5))
      console.log('Qb Event Map Keys:', Array.from(qbEventsMap.keys()).slice(0,5))
      console.log('final matches:', matches)
      console.log('final mismatches: ', amountMismatches)
      console.log('=== END DEBUG ===')

      return {matches, nwgOnly, qbOnly, amountMismatches}
    }

    const eventAnalysis = $derived.by(() => findMatchingEvents())
    const matchedQbIndices = $derived(Array.from(eventAnalysis.matches.values()))

    function getNwgRowClass(index){
      if (eventAnalysis.nwgOnly.includes(index)) return 'bg-blue-300 border-l-4 border-l-blue-500'
      if (eventAnalysis.amountMismatches.some(m => m.nwgIndex === index)) return 'bg-orange-300 border-l-4 border-l-orange-500'
      if (eventAnalysis.matches.has(index)) return 'bg-green-300 border-l-4 border-l-green-500'
      return ''
    }

    function getQbRowClass(index){
      if (eventAnalysis.qbOnly.includes(index)) return 'bg-red-300 border-l-4 border-l-red-500'
      if (eventAnalysis.amountMismatches.some(m => m.qbIndex === index)) return 'bg-orange-300 border-l-4 border-l-orange-500'
      if (matchedQbIndices.includes(index)) return 'bg-green-300 border-l-4 border-l-green-500'
      return ''
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
    opacity: 0.7;
  }
</style>

<div class='mb-4 p-4 rounded-lg border'>
  <h3 class='text-lg font-semibold mb-2'>Legend</h3>
  <div class='grid grid-cols-2 md:grid-cols-4 gap-2 text-sm'>
    
    <div class='flex items-center'>
      <div class='w-4 h-4 bg-green-300 border-l-4 border-l-green-500 mr-2'></div>
      <span>Matched Events</span>
    </div>

    <div class='flex items-center'>
      <div class='w-4 h-4 bg-blue-300 border-l-4 border-l-blue-500 mr-2'></div>
      <span>NWG Only</span>
    </div>

    <div class='flex items-center'>
      <div class='w-4 h-4 bg-red-300 border-l-4 border-l-red-500 mr-2'></div>
      <span>QB Only</span>
    </div>

    <div class='flex items-center'>
      <div class='w-4 h-4 bg-orange-300 border-l-4 border-l-orange-500 mr-2'></div>
      <span>Amount Mismatch</span>
    </div>

  </div>
</div>

// potentially include summary info

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
        {#each sortedNwgEvents as event, index}
        <tr class={getNwgRowClass(index)}>
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
        {#each sortedQbEvents as qbevent, index}
         <tr class={getQbRowClass(index)}>
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
