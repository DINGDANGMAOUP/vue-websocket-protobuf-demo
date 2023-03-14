<template>
  <h1>{{ title }}</h1>
  <div>
    hello
  </div>
  <button @click="sendMessage">发送消息</button>
</template>

<script setup lang="ts">

import {onMounted, ref} from 'vue'
import {WebsocketMessage, WebsocketMessage_MessageBody} from "@/proto/WebsocketMessages"

const stringToUint8Array = (str: string) => {
  const arr = [];
  let i = 0, j = str.length;
  for (; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }

  return new Uint8Array(arr)
}
let messageData: WebsocketMessage_MessageBody = {
  operationType: 0,
  identify: 123n,
  context: stringToUint8Array("hello,i am clint"),
}
let websocketRequest: WebsocketMessage = {
  flag: 1,
  timestamp: 123456789n,
  body: messageData,
};

let bytes = WebsocketMessage.toBinary(websocketRequest);
// pete = Person.fromBinary(bytes);
defineProps<{ title: string }>()


const a = ref(1)

let ws: WebSocket;
const init = () => {
  ws = new WebSocket('ws://127.0.0.1:19999/websocket')
  ws.binaryType = "arraybuffer";
  ws.onclose = close;
  ws.onerror = onError;
  ws.onopen = open;
  ws.onmessage = message;
  setTimeout(() => {
  }, 1000)
}
const open = () => {
  console.log("connect success")
}
const message = (ev: MessageEvent) => {
  console.log("收到消息,{}", WebsocketMessage.fromBinary(new Uint8Array(ev.data)))
}

const close = () => {  //关闭
  console.log('断开连接');
}

const onError = () => {
  console.log('连接异常');
}
const sendMessage = () => {
  ws.send(bytes);
}
onMounted(() => {
  init()
})
</script>

<style scoped>

</style>