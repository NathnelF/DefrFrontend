<script>
    let xflip = -1;
    let yflip = -1;

    setInterval(() => {
        xflip *= -1;
    }, 1000);

    setInterval(() => {
        yflip *= -1;
    }, 1320);

</script>

<main class="flex items-center justify-center min-h-screen">
    <div class="avatar">
        <div class="w-65 rounded-xl">
            <img src="https://img.daisyui.com/images/profile/demo/yellingwoman@192.webp" alt="woman in tears pointing at cat"/>
        </div>
    </div>
    <div class="avatar">
        <div class="w-65 rounded-full"
        style="transform: scaleX({xflip}) scaleY({yflip});">
            <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" alt="smug cat laughing at crying woman"/>
        </div>
    </div>
</main>