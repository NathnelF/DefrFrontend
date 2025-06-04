<script> 
    let { nwgEvents, qbEvents } = $props();
    import { readableDate } from "$lib/utils/dateConverter";
</script>

<div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
  <table class="table text-left">
    <caption class="text-2xl font-bold p-3 text-left">Revenue Recogntion Report</caption>
    <thead>
      <tr>
        <th>Date</th>
        <th>Contract</th>
        <th>Balance</th>
      </tr>
    </thead>
    <tbody>
      {#each nwgEvents as event}
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

<div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
  <table class="table text-left">
    <caption class="text-2xl font-bold p-3 text-left">Revenue Recogntion Report</caption>
    <thead>
      <tr>
        <th>QB Date</th>
        <th>QB Line Desc</th>
        <th>QB Name</th>
        <th>QB Amount</th>
      </tr>
    </thead>
    <tbody>
      {#each qbEvents as qbevent}
      <tr>
        <td>{readableDate(qbevent.date)}</td>
        <td>{qbevent.lineDescription}</td>
        <td>{qbevent.Name}</td>
        <td>{qbevent.amount.toFixed(2)}</td>
        <td></td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>