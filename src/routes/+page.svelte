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
    <div class="flex flex-col items-center">
        <p>Welcome, {user.email}</p>
        <form action="?/logout" method="POST">
            <button class="btn" type="submit">Logout</button>
        </form>
    </div>
{:else}
    <a href="https://localhost:7246/google-signin">Sign in with Google</a>
{/if}
</main>
