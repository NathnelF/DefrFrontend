<script>
    let {contracts, names} = $props();

    //TODO: await contracts and render them if they exist

    //If they don't direct to new contract page.

    //TODO: add edit contract page
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
        <td>{contract.currentTermStart}</td>
        <td>{contract.currentTermEnd}</td>
        <td class="text-center">
            <a class="btn outline text-s" href="contracts/{contract.id}/schedule">Schedule</a>
            <a class="btn btn-ghost text-s" href="contracts/{contract.id}/edit">Edit</a>
        </td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>