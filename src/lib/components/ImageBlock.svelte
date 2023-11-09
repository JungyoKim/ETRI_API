<script>
  import { createEventDispatcher } from 'svelte';
  import { slide,fade } from 'svelte/transition';
  
  export let base64;
  export let name;
  export let content;

  const dispatch = createEventDispatcher();

  function deleteThisComponent() {
    dispatch('deleteComponent');
  }


  let text;
  let height = 'auto';

  $: if (text) {
    height = `${text.offsetHeight}px`;
  }


  import { onMount } from 'svelte';


  let resizedBase64; // 해상도가 낮춰진 이미지

  onMount(async () => {
    resizedBase64 = await resizeBase64Img(base64, 100); // 100은 원하는 너비입니다.
  });

  function resizeBase64Img(base64, newWidth) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = base64;
      img.onload = () => {
        // 원본 이미지의 비율을 유지하면서 새로운 높이를 계산합니다.
        let newHeight = img.height * (newWidth / img.width);
        
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        resolve(canvas.toDataURL());
      };
      img.onerror = reject;
    });
  }
  
</script>

<div class="grid grid-cols-1 gap-y-3 mt-3 grid-flow-row-dense font-main">
  <div class="rounded-lg shadow-2xl">
      <div class="grid grid-cols-1 grid-flow-row-dense">
          <div class="bg-gradient-to-r from-yellow-500 to-yellow-200 rounded-t-lg shadow-xl col-span-1 text-center p-2 text-md">
              <div class="flex justify-between">
                      <div class="max-w-[150px] no-select bg-white rounded-md px-1 mr-1 overflow-hidden">
                        <p class="animate-marquee single-line">{name}로 만든 이야기</p>
                      </div>
                  <div class="flex justify-between">
                  <button class="flex justify-between hover:bg-white rounded-md px-1 mr-1">
                      <span class="no-select mr-1">복사</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-copy"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                  
                  <button on:click={deleteThisComponent} class="flex justify-between hover:bg-red-500 hover:text-white rounded-md px-1 ml-1">
                      <span class="no-select mr-1">삭제</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                  </div>
              </div>
          </div>

          <div class="bg-white rounded-b-lg shadow-xl col-span-1 text-left p-3 font-code text-md">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <img class="rounded-md h-full" in:slide out:slide style="height: 300px" src={resizedBase64} alt="test" />
              <p class="font-main" out:fade bind:this={text}>{content}</p>
            </div>
        </div>
      </div>
  </div>
  </div>


  <style>
    .animate-marquee {
        display: inline-block;
        padding-left: 100%;
        animation: marquee 10s linear infinite;
    }

    .single-line {
    white-space: nowrap;
  }

    @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-110%); }
    }
</style>