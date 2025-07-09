<script>
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

<main class="flex items-center justify-center min-h-screen">
    
    {#if user != null}
    <p>Welcome, {user.email}</p>
    <a href="/logout">Logout</a>
    {:else}
    <a href="https://localhost:7246/google-signin">Sign in with Google</a>
    {/if}
</main>