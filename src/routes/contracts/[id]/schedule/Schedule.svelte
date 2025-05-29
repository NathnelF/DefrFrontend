<script>
    let { events, contractName } = $props(); 
    import { readableDate } from '$lib/utils/dateConverter'
</script>

<div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
  <table class="table">
    <caption class="text-2xl font-bold p-3 text-left">Recogntion schedule for {contractName}</caption>
    <thead>
      <tr>
        <th>Date</th>
        <th>Balance</th>
      </tr>
    </thead>
    <tbody>
      {#each events as event}
      <tr>
        <td>{readableDate(event.date)}</td>
        <td>{event.amount.toFixed(2)}</td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>