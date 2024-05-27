import settings from './config';
import './features/MelodyDisplay';

register("command", () => {
    settings.openGUI()
}).setName("melodyhelper").setAliases("mh");
