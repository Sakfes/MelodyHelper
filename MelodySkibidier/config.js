// By Sakfes and teeTu97

import {
    @ButtonProperty,
    @CheckboxProperty,
    Color,
    @ColorProperty,
    @PercentSliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @Vigilant,
    @SliderProperty
} from '../Vigilance/index';

@Vigilant("MelodySkibidier", "Melody Helper", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["Features"];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})

class Settings {

    @SwitchProperty({
        name: "Melody Helper",
        description: "Displays melody progress on the screen under ur crosshair",
        category: "Features",
        subcategory: "Melody"
    })
    helper = false

    constructor() {
        this.initialize(this);
        this.setCategoryDescription("Features", "&6&lBy Sakfes and teeTu97")
        this.setSubcategoryDescription("Features", "Melody", "&bHelper only works with melody progress messages containing 1/4, 2/4 etc.")
    }
}

export default new Settings();