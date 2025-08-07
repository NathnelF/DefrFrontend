<script>
    import 'root/app.css'
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    let user = $state(null)

    onMount(async () => {
        const res = await fetch('/user');
        if (res.ok) {
            user = await res.json();
        }
    });
</script>

{#if user != null}

    <div class="navbar bg-base-100 shadow-sm">
    	<a class="btn btn-ghost text-xl" href="/">Home</a>
    	<a class="btn btn-ghost text-xl" href="/contracts">Contracts</a>
    	<a class="btn btn-ghost text-xl" href="/compare">Compare</a>
    	<a class="btn btn-ghost text-xl" href="/report">Report</a>
    	<a class="btn btn-ghost text-xl" href="/quickbooks">Quickbooks</a>
    </div>
    <div class="flex flex-col items-center justify-center h-screen">
        <p>Welcome, {user.email}</p>
        <form action="?/logout" method="POST">
            <button class="btn" type="submit">Logout</button>
        </form>
    </div>
{:else}
    <div class="flex items-center justify-center h-screen">
        <a href="https://localhost:7246/google-signin">Sign in with Google</a>
    </div>
{/if}
