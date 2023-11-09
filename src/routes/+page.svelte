<script>
    import ImageBlock from '$lib/components/ImageBlock.svelte';
    import { slide,fade } from 'svelte/transition';
    import { writable } from 'svelte/store';
    let file;
    let image64 = "";
    let components = writable([]);
    let fileName = "여기를 눌러 사진을 업로드하십시오";
    let message = "";
    let making = 0;
    let error = 0;
    let res = "";

    function onFileChange(event) {
        file = event.target.files[0];
        fileName = file ? file.name : "";
        message = fileName ? "시작하려면 오른쪽 버튼을 클릭하십시오" : "";
        
        if (file) {
            console.log(making)
            const reader = new FileReader();
            reader.onload = function(e) {
                image64 = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    }

async function fetchData() {
const fileType = fileName.split('.').pop();
const fileCon = image64;
console.log(fileType,String(image64))
  try {
    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: fileCon,
        type: fileType
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res = data.res;
    console.log(res); 
    return res;
  } catch(error) {
    console.error('Error:', error);
  }
}

async function onSubmit(event) {
    if (!file) {
        event.preventDefault();
    } else {
        making = 1;
        file = "";
        message = "제작중입니다";
        res = await fetchData();
        components.update(n => [...n, { id: Date.now(), data: image64, name: fileName, content: res }]);
        making = 0;
        fileName = "";
        message = "여기를 눌러 사진을 업로드하십시오";
        image64 = "";
    }
}

</script>

<div class="xl:mx-[300px]">
<div class="z-50 p-3 flex justify-between sticky top-0 bg-black">
      <div style="font-family: 'Parisienne', cursive;" class="no-select text-slate-100 text-sm text-xl mt-1 font-bold">Hermes</div>
      <div class="flex justify-between">

          {#if error}
      <div transition:slide class="mr-2 bg-gradient-to-r from-red-500 to-pink-500 py-1 px-2 rounded-lg text-white font-main">
          ⚠️
      </div>
      {/if}
      {#if making == 1}
      <div transition:slide class="mr-2 bg-gradient-to-r from-yellow-500 to-yellow-500 py-1 px-2 rounded-lg text-white font-main">
        제작중
      </div>
  {/if}

  <div class="flex items-center w-[150px] bg-slate-100 rounded-lg row-end">
    <div class="w-full relative overflow-hidden">
        <input type="file" accept="image/*" on:change={onFileChange} class="absolute inset-0 cursor-pointer opacity-0" id="fileUpload" style="z-index: 2; position: absolute;">
        <div class="no-select w-full px-4 py-1 bg-slate-100 text-gray-800 rounded-l-lg focus:outline-none hover:bg-gray-300 whitespace-nowrap" id="fileUploadName">
            <div class="animate-marquee select-none">
                {@html `${fileName}${fileName ? "&nbsp;&nbsp;&nbsp;" : ""}${message}`}
            </div>
        </div>
    </div>
    <div style="flex-shrink: 0;">
        <button type="submit" on:click={onSubmit} class="flex items-center justify-center w-12 h-8 text-white rounded-r-lg {file ? 'bg-yellow-200 hover:bg-yellow-900' : 'bg-gray-500 cursor-not-allowed'}">
            {#if making == 0}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                    <path d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z" stroke="	#000000" stroke-width="2" stroke-linejoin="round"/>
                </svg>
                {/if}
                {#if making}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 0 25 25" fill="none" class="h-5 w-5">
                    <path d="M17 3.42004H7C4.79086 3.42004 3 5.2109 3 7.42004V17.42C3 19.6292 4.79086 21.42 7 21.42H17C19.2091 21.42 21 19.6292 21 17.42V7.42004C21 5.2109 19.2091 3.42004 17 3.42004Z" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {/if}
        </button>
    </div>
</div>
    
  </div>
      </div>
  
      <div class="-z-50 px-3 h-50">
          <div class="no-select md:flex md:justify-left font-regular relative block w-full rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-200 p-3 text-base text-black font-main opacity-100">
              
              <h1 class="mr-2 font-bold">헤르메스는 사진속 사물을 이용하여 재미있는 이야기를 만들어줍니다</h1>

          </div>
          </div>
  
  <div class="min-w-[20rem] px-3 pb-3 flex flex-col">

    {#each $components as component (component.id)}
    <div in:fade out:slide>
    <ImageBlock base64={component.data} name={component.name} content={component.content} on:deleteComponent={() => {
      components.update(n => n.filter(item => item.id !== component.id));
    }}/>
    </div>
  {/each}


  {#if making == 1}
  <div transition:slide class="mt-3 h-100">
      <div class="flex justify-between">
      <img class="h-20" src="https://studio.code.org/v3/assets/jtsBLtSsNJI3daNYqb36EITpGdTK5dtoxHYBy-jmWEc/loaderupdated-(2).gif" alt="Loading..."/>
      <img class="h-20" src="https://studio.code.org/v3/assets/jtsBLtSsNJI3daNYqb36EITpGdTK5dtoxHYBy-jmWEc/loaderupdated-(2).gif" alt="Loading..."/>
      <img class="h-20" src="https://studio.code.org/v3/assets/jtsBLtSsNJI3daNYqb36EITpGdTK5dtoxHYBy-jmWEc/loaderupdated-(2).gif" alt="Loading..."/>
        
  </div>
  </div>
  {/if}
  
  <div class="w-full p-5">
      
  </div>
  
  </div>
</div>
  
  <div class="no-select p-1 flex justify-between w-full fixed bottom-0 bg-gradient-to-r from-yellow-500 to-yellow-200 font-main text-black text-lg">
      <h1 class="ml-2">SOURCE</h1>
      <button class="flex text-black px-2" onclick="window.open('https://github.com/JungyoKim/ETRI_API')">
          
          <span class="mr-1">GITHUB</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
      </button>
  </div>

  <style>
    .animate-marquee {
        display: inline-block;
        padding-left: 100%;
        animation: marquee 5s linear infinite;
    }

    @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-110%); }
    }
</style>
