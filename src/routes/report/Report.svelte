<script> 
    let { events } = $props();
</script>

<div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
  <table class="table text-left">
    <thead>
      <tr>
        <th>Date</th>
        <th>Contract</th>
        <th>Balance</th>
      </tr>
    </thead>
    <tbody>
      {#each events as event}
      <tr>
        <td>{event.date}</td>
        <td>{event.contractId}</td>
        <td>{event.amount}</td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>