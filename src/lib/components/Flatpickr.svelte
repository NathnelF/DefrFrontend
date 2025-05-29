<script>
    import { onMount } from 'svelte';
    import flatpickr from 'flatpickr';
    import "flatpickr/dist/flatpickr.css"

    let { id, label, value=$bindable() } = $props();
    let fp = undefined;
    //console.log("initalized variables");
    
    onMount( () => {
        fp = flatpickr(`#${id}`, {
        allowInput: true,
        dateFormat: 'Y-m-d',
        altInput: true,
        altFormat: 'm/d/Y',
    });
    //console.log("fp mounted");
    return () => {
        fp.destroy();
        //console.log("fp unmounted")
    }

    }); 
    //console.log("moving on")
    
    
</script>

<div class="flex flex-col mr-5">
    <label for={id} class=" mx-4.5 mt-3 mb-1 text-gray-200">{label}</label>
    <input {id} type="text" class="input mx-4 mb-3" bind:value={value}/>
</div>