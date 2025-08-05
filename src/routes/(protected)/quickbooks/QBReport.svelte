<script> 
    let { events } = $props();
    import { readableDate } from "$lib/utils/dateConverter";
</script>

<div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
  <table class="table text-left">
    <caption class="text-2xl font-bold p-3 text-left">Revenue Recogntion Report</caption>
    <thead>
      <tr>
        <th>Date</th>
        <th>Line Description</th>
        <th>Name</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      {#each events as event}
      <tr>
        <td>{readableDate(event.date)}</td>
        <td>{event.lineDescription}</td>
        <td>{event.name}</td>
        <td>{event.amount.toFixed(2)}</td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>