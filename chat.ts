import { Room } from "colyseus";

export class ChatRoom extends Room {
    // this room supports only 4 clients connected
    maxClients = 4;

    onCreate (options: any) {
        console.log("BasicRoom created!", options);
    }

    onJoin (client: { sessionId: any; }) {
        this.broadcast(`${ client.sessionId } joined.`);
    }

    onLeave (client: { sessionId: any; }) {
        this.broadcast(`${ client.sessionId } left.`);
    }

    onMessage (client: { sessionId: any; }, data: { message: any; }) {
        console.log("BasicRoom received message from", client.sessionId, ":", data);
        this.broadcast(`(${ client.sessionId }) ${ data.message }`);
    }

    onDispose () {
        console.log("Dispose BasicRoom");
    }

}