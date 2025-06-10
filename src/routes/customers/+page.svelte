<script>
    let { data } = $props()
    let { customers, error, success} = data
</script>

<div class="flex flex-col">
{#each customers as customer}
<button class="btn w-1/6" popovertarget="${customer.name}">
  {customer.name}
</button>

<ul class="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
    popover id="${customer.name}">
    {#each customer.contracts as contract}
    <li><a href="/contracts/{contract.id}/schedule">{contract.name}</a></li>
    {/each}
</ul>
{/each}
</div>
