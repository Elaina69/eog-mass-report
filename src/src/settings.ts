import { UI } from "./settingsUI.ts"
import { reportTypes } from "./reportTypes.ts";

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

    private reportTarget = {
        "EOG-Mass-Report_reportTarget": [
            {
                "id": 0,
                "type": "Allies"
            },
            {
                "id": 1,
                "type": "Enemy"
            },
            {
                "id": 2,
                "type": "All"
            },
        ]
    }

    private reportOption = {
        "EOG-Mass-Report_reportOption": [
            {
                "id": 0,
                "type": "Random",
                "description": "Will randomly select a selected report type below."
            },
            {
                "id": 1,
                "type": "Specific",
                "description": "Will use all the selected report type."
            }
        ]
    }

    settingsUI = (panel: any) => {
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
                UI.Dropdown(this.reportTarget, "EOG-Mass-Report_reportTarget", "Report target", "type", "id"),
                document.createElement('br'),
                UI.Dropdown(this.reportOption, "EOG-Mass-Report_reportOption", "Report option", "type", "id", "reportOptionDropdown"),
                UI.Label(this.reportOption["EOG-Mass-Report_reportOption"][window.DataStore.get("EOG-Mass-Report_reportOption")].description, "reportOptionDescription"),
                document.createElement('br'),
                UI.CheckBox(
                    reportTypes[0].text, 
                    `reportType_${reportTypes[0].name}`, 
                    `reportType_${reportTypes[0].name}_box`, 
                    () => {}, 
                    true, `EOG-Mass-Report_${reportTypes[0].name}`
                ),
                document.createElement('br'),
                UI.CheckBox(
                    reportTypes[1].text, 
                    `reportType_${reportTypes[1].name}`, 
                    `reportType_${reportTypes[1].name}_box`, 
                    () => {}, 
                    true, `EOG-Mass-Report_${reportTypes[1].name}`
                ),
                document.createElement('br'),
                UI.CheckBox(
                    reportTypes[2].text, 
                    `reportType_${reportTypes[2].name}`, 
                    `reportType_${reportTypes[2].name}_box`, 
                    () => {}, 
                    true, `EOG-Mass-Report_${reportTypes[2].name}`
                ),
                document.createElement('br'),
                UI.CheckBox(
                    reportTypes[3].text, 
                    `reportType_${reportTypes[3].name}`, 
                    `reportType_${reportTypes[3].name}_box`, 
                    () => {}, 
                    true, `EOG-Mass-Report_${reportTypes[3].name}`
                ),
                document.createElement('br'),
                UI.CheckBox(
                    reportTypes[4].text, 
                    `reportType_${reportTypes[4].name}`, 
                    `reportType_${reportTypes[4].name}_box`, 
                    () => {}, 
                    true, `EOG-Mass-Report_${reportTypes[4].name}`
                ),
                document.createElement('br'),
                UI.CheckBox(
                    reportTypes[5].text, 
                    `reportType_${reportTypes[5].name}`, 
                    `reportType_${reportTypes[5].name}_box`, 
                    () => {}, 
                    true, `EOG-Mass-Report_${reportTypes[5].name}`
                ),
                document.createElement('br'),
                UI.CheckBox(
                    reportTypes[6].text, 
                    `reportType_${reportTypes[6].name}`, 
                    `reportType_${reportTypes[6].name}_box`, 
                    () => {}, 
                    true, `EOG-Mass-Report_${reportTypes[6].name}`
                ),
                document.createElement('br'),
                UI.CheckBox(
                    reportTypes[7].text, 
                    `reportType_${reportTypes[7].name}`, 
                    `reportType_${reportTypes[7].name}_box`, 
                    () => {}, 
                    true, `EOG-Mass-Report_${reportTypes[7].name}`
                ),
                document.createElement('br'),
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

                        document.getElementById("reportOptionDropdown")?.addEventListener("click", () => {
                            document.getElementById("reportOptionDescription")!.innerText = this.reportOption["EOG-Mass-Report_reportOption"][window.DataStore.get("EOG-Mass-Report_reportOption")].description
                        })
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