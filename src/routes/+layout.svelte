<script>
	import '../app.css';
	
	let { children } = $props();
</script>

<div class="navbar bg-base-100 shadow-sm">
	<a class="btn btn-ghost text-xl" href="/">Home</a>
	<a class="btn btn-ghost text-xl" href="/contracts">Contracts</a>
	<a class="btn btn-ghost text-xl" href="/compare">Compare</a>
	<a class="btn btn-ghost text-xl" href="/report">Report</a>
	<a class="btn btn-ghost text-xl" href="/quickbooks">Quickbooks</a>
	<a class="btn btn-ghost text-xl" href="/customers">Customers</a>

</div>



{@render children()}
