import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
    @type("number")
    x = 0;

    @type("number")
    y = 0;

    @type("number")
    velX = Math.floor(Math.random() * 400);

    @type("number")
    velY = Math.floor(Math.random() * 400);

    @type('string')
    name = "TestName";
}

export class State extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();

    something = "This attribute won't be sent to the client-side";

    createPlayer (id: string) {
        this.players[ id ] = new Player();
    }

    removePlayer (id: string) {
        delete this.players[ id ];
    }

    movePlayer (id: string, movement: any) {
        if (movement.x) {
            this.players[ id ].x += movement.x;

        } else if (movement.y) {
            this.players[ id ].y += movement.y;
        }
    }
}

export class StateHandlerRoom extends Room<State> {
    maxClients = 10;

    onCreate (options: any) {
        console.log("StateHandlerRoom created!", options);

        this.setState(new State());
    }

    onJoin (client: Client) {
        this.state.createPlayer(client.sessionId);
    }

    onLeave (client: { sessionId: string; }) {
        this.state.removePlayer(client.sessionId);
    }

    onMessage (client: { sessionId: string; }, data: any) {
        console.log("StateHandlerRoom received message from", client.sessionId, ":", data);
        this.state.movePlayer(client.sessionId, data);
    }

    onDispose () {
        console.log("Dispose StateHandlerRoom");
    }

}
