<script>
	import '../app.css';
	
	let { children } = $props();
</script>

<div class="navbar bg-base-100 shadow-sm">
	<a class="btn btn-ghost text-xl" href="/">Home</a>
	<a class="btn btn-ghost text-xl" href="/contracts">Contracts</a>
	<a class="btn btn-ghost text-xl" href="/report">Report</a>
</div>



{@render children()}
