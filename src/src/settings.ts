import { UI } from "./settingsUI.ts"

class Settings {
    data: { 
        groupName: string; 
        titleKey: string; 
        titleName: string; 
        capitalTitleKey: string; 
        capitalTitleName: string; 
        element: { 
            name: string; 
            title: string; 
            titleName: string; 
            class: string; 
            id: string 
        }[] 
    }[]
    
    constructor () {
        this.data = [
            {
                "groupName": 'eog-mass-report',
                "titleKey": 'el_eog-mass-report',
                "titleName": 'EOG Mass Report',
                "capitalTitleKey": 'el_eog-mass-report_capital',
                "capitalTitleName": 'EOG MASS REPORT',
                "element": [
                    {
                        "name": "eog-mass-report-settings",
                        "title": "el_eog-mass-report-settings",
                        "titleName": "SETTINGS",
                        "class": "eog-mass-report-settings",
                        "id": "eog-mass-report-settings",
                    },
                ],
            },
        ]
    }

    settingsUI = (panel: any) => {
        let option = {
            "EOGReportList": [
                {
                    "id": 0,
                    "type": "Allies"
                },
                {
                    "id": 1,
                    "type": "Enermy"
                },
                {
                    "id": 2,
                    "type": "All"
                },
            ]
        }

        panel.prepend(
            UI.Row("",[
                UI.Row("Info",[
                    UI.Row("Info-div",[
                        UI.Link(
                            'EOG Mass Report',
                            'https://github.com/Elaina69/Elaina-V4',
                            () => {},""
                        )
                    ]),
                ]),
                UI.CheckBox("End of game mass report", "eogrp", "eogrpbox", () => {}, true, "EOG-Mass-Report"),
                document.createElement('br'),
                UI.Dropdown(option, "EOGReportList", "Report list", "type", "id")
            ])
        )
    }

    injectSettingsUI = () => {
        const interval = setInterval(() => {
            const manager = document.getElementById('lol-uikit-layer-manager-wrapper')
            
            if (manager) {
                clearInterval(interval)
                new MutationObserver((mutations) => {
                    const plugin = document.querySelector('lol-uikit-scrollable.eog-mass-report-settings')

                    if (plugin && mutations.some((record) => Array.from(record.addedNodes).includes(plugin))) {
                        this.settingsUI(plugin)
                    }
                }).observe(manager, {
                    childList: true,
                    subtree: true
                })
            }
        },500)
    }
}
let settings = new Settings()

export { settings }