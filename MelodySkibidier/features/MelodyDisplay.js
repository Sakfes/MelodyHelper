import settings from '../config'

const PREFIX = "Party > ";
const MELODY_MESSAGE = /Party > .* (\w+): .* (\d)\/4/;
const TERMINAL_MESSAGE = /(\w+) activated a terminal! \(\d\/\d\)/;
const TERMINAL_COMPLETE_MESSAGE = /.+ (activated|completed) a .+! \((\d)\/(\d)\)/;
const GATE_DESTROYED_MESSAGE = "The gate has been destroyed!";
const CORE_ENTRANCE_OPENING_MESSAGE = "The Core entrance is opening!";
const S29PacketSoundEffect = Java.type("net.minecraft.network.play.server.S29PacketSoundEffect");
let playerName = "";
let melodyProgress = "";
let renderMessage = false;
let gateDestroyed = false;
let coreEntranceOpening = false;
let allTerminalsCompleted = false;

register("chat", () => {
	inP3 = true
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance.")

register("chat", () => {
	inP3 = false
}).setCriteria("The Core entrance is opening!")

register("chat", (event) => {
    if (!settings.helper)
        return;
    if (!inP3)
        return;

    const message = ChatLib.removeFormatting(ChatLib.getChatMessage(event));

    if (message.startsWith(PREFIX)) {
        const melodyMatch = message.match(MELODY_MESSAGE);
        if (melodyMatch) {
            playerName = melodyMatch[1];

            if (playerName === Player.getName())
                return;

                melodyProgress = ` ${melodyMatch[2]}/4`;
                renderMessage = true;
                playSound("random.orb", 7, 1);
        }
    }

    const terminalMatch = message.match(TERMINAL_MESSAGE);
    if (terminalMatch) {
        const terminalPlayer = terminalMatch[1];

        if (terminalPlayer === playerName) {
            renderMessage = false;
        }
    }

    const terminalCompleteMatch = message.match(TERMINAL_COMPLETE_MESSAGE);
    if (terminalCompleteMatch) {
        const current = parseInt(terminalCompleteMatch[2]);
        const total = parseInt(terminalCompleteMatch[3]);

        if (current === total && total >= 7) {
            allTerminalsCompleted = true;
        }
    }

    if (message === GATE_DESTROYED_MESSAGE) {
        gateDestroyed = true;
    }

    if (message === CORE_ENTRANCE_OPENING_MESSAGE) {
        coreEntranceOpening = true;
    }

    if ((gateDestroyed || coreEntranceOpening) && allTerminalsCompleted) {
        renderMessage = false;
        gateDestroyed = false;
        coreEntranceOpening = false;
        allTerminalsCompleted = false;
    }
});

register("renderOverlay", () => {
    if (renderMessage && playerName) {
        if (playerName === Player.getName())
            return;
        const displayMessage = `${playerName} has Melody!${melodyProgress}`;
        Renderer.drawStringWithShadow(displayMessage, Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(displayMessage) / 2, Renderer.screen.getHeight() / 2 + 10);
    }
});

function playSound(soundName, volume, pitch) {
    try {
        new S29PacketSoundEffect(soundName, Player.getX(), Player.getY(), Player.getZ(), volume, pitch).func_148833_a(Client.getConnection());
    } catch (error) { }
}

register("worldLoad", () => {
    renderMessage = false;
    inP3 = false
});