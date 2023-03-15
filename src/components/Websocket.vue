<template>
  <h1>{{ title }}</h1>
  <div>
    hello
  </div>
  <button @click="sendMessage">发送消息</button>
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

let heartbeatData: MessageData = {
  operationType: OperationType.HEARTBEAT,
  identify: 123n,
  context: stringToUint8Array("hello,i am clint"),
}

let heartbeatRequest: WebsocketMessage = {
  flag: MessageFlag.WEB,
  timestamp: 123456789n,
  body: heartbeatData,
};

let bytes = WebsocketMessage.toBinary(websocketRequest);

let heartbeatBytes = WebsocketMessage.toBinary(heartbeatRequest);
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
  WebsocketMessage.fromBinary(new Uint8Array(ev.data))
  console.log("收到消息,{}" )
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