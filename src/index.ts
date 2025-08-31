 /**
 * @name EOG_Mass_Report
 * @author Elaina Da Catto
 * @description End of game mass report plugins for Pengu Loader
 * @link https://github.com/Elaina69
 * @Nyan Meow~~~
 */

import { log } from "./src/log.ts"
import { massReport } from "./src/report.ts"
import { settings } from "./src/settings.ts"
import { settingsUtils } from "./src/settingsUtils.ts"

// Set default Datastore
if (!window.DataStore.has("EOG-Mass-Report"))               window.DataStore.set("EOG-Mass-Report", true)
if (!window.DataStore.has("EOG-Mass-Report_reportTarget"))  window.DataStore.set("EOG-Mass-Report_reportTarget", 2)
if (!window.DataStore.has("EOG-Mass-Report_reportOption"))  window.DataStore.set("EOG-Mass-Report_reportOption", 0)

let main = async (mode: number) => {
    log("Start running...")
   
    await massReport.getPlayerList()
    
    switch (mode) {
        case 0:
            log("Reporting allies..")
            await massReport.report(massReport.allies)
            break;
        case 1:
            log("Reporting enermy...")
            await massReport.report(massReport.opponents)
            break;
        case 2: 
            log("Reporting all...")
            await massReport.report(massReport.allies)
            await massReport.report(massReport.opponents)
            break;
        default:
            log("Mass report is turn off.")
            break;
    }

    log("Complete.")
}

window.addEventListener("load", () => {
    console.log(massReport.getReportType())
    settings.injectSettingsUI()
})

export function init (context: any) {
    context.socket.observe('/lol-gameflow/v1/gameflow-phase',async (data: any) => {
        console.log(data)
        if (data["data"] == "EndOfGame" && window.DataStore.get("EOG-Mass-Report")) {
            await main(window.DataStore.get("EOG-Mass-Report_reportTarget"))
        }
    })

    settingsUtils(context, settings.data)
}