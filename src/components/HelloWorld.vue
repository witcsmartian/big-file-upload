<template>
  <div class="hello">
    <input type="file" ref="inputRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const inputRef = ref<HTMLInputElement | null>(null);

const CHUNK_SIZE = 10 * 1024;

const THREAD_COUNT = navigator.hardwareConcurrency || 4;

const cutFile = async (file: File) => {
  return new Promise((resolve) => {
    const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
    const threadCount = Math.ceil(chunkCount / THREAD_COUNT);
    const result: any[] = [];
    let finishCount = 0;

    for (let i = 0; i < THREAD_COUNT; ++i) {
      const start = i * threadCount;
      const end = Math.min(start + threadCount, chunkCount);

      const worker = new Worker(new URL("./worker", import.meta.url), {
        type: "module",
      });

      console.log("wewew ", worker);

      worker.onerror = (e) => {
        console.log("onerror ", e);
      };

      worker.postMessage({
        file,
        start,
        end,
        CHUNK_SIZE,
      });

      worker.onmessage = (e) => {
        result[i] = e.data;
        finishCount++;

        if (finishCount === threadCount) {
          resolve(result);
        }
      };
    }
  });
  // const result = [];

  // for (let i = 0; i < chunkCount; i++) {
  //   const chunk = await creatChunk(file, i, CHUNK_SIZE);
  //   result.push(chunk);
  // }

  // return result;
};

onMounted(() => {
  if (!inputRef.value) {
    return;
  }

  inputRef.value.onchange = async (e) => {
    // @ts-ignore
    const file = e.target.files[0] as File;

    console.time("start");

    const chunks = await cutFile(file);

    console.timeEnd("start");

    console.log("chunks ", chunks);
  };
});
</script>
