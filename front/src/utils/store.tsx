import { create } from 'zustand'
import io from "socket.io-client";

const serverUrl = "https://wglxz242-3000.use.devtunnels.ms/"
const socket = io(serverUrl);

export type TStore = {
    setListeners: any;
    socket: any
}
export const useStore = create<TStore>()((set, get) => ({
    socket: socket,
    setListeners: () => {
        const {socket} = get();

        socket.on("connect", () => {
            console.log("Connected to socket!");
        })

        socket.on("todos", (data:any) => {
            console.log("Received todos");
            console.log(data);
        })
    } 
}))

