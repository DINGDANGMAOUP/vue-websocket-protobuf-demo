<template>
  <h1>{{ title }}</h1>
  <div>
    hello
  </div>
  <button @click="()=>sendMessage(bytes)">发送消息</button>
</template>

<script setup lang="ts">

import {onMounted, ref} from 'vue'
import {
  WebsocketMessage,
  WebsocketMessage_MessageBody as MessageData,
  WebsocketMessage_MessageBody_OperationType as OperationType,
  WebsocketMessage_MessageFlag as MessageFlag
} from "@/proto/WebsocketMessages"

const stringToUint8Array = (str: string) => {
  const arr = [];
  let i = 0, j = str.length;
  for (; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }

  return new Uint8Array(arr)
}
let messageData: MessageData = {
  operationType: OperationType.OPENAI,
  identify: 123n,
  context: stringToUint8Array("hello,i am clint"),
}
let websocketRequest: WebsocketMessage = {
  flag: MessageFlag.WEB,
  timestamp: 123456789n,
  body: messageData,
};

let bytes: Uint8Array = WebsocketMessage.toBinary(websocketRequest);

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

}
const open = () => {
  console.log("connect success")
}
const message = (ev: MessageEvent) => {
  const msg = WebsocketMessage.fromBinary(new Uint8Array(ev.data))
  console.log("收到消息", msg)
}

const close = () => {  //关闭
  console.log('断开连接');
}

const onError = () => {
  console.log('连接异常');
}
const sendMessage = (msg: Uint8Array) => {
  ws.send(msg.buffer);
}
onMounted(() => {
  init()
})
</script>

<style scoped>

</style>