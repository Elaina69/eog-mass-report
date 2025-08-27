import { log } from "./log.ts"
import { reportTypes } from "./reportTypes.ts";

class FetchData {
    get = async (lcu: string) => {
        let data = (await fetch(lcu)).json()
        return data
    }

    post = async (lcu: string, body: any) => {
        await fetch(lcu, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
    }
}

class MassReport extends FetchData {
    allies: any[]
    opponents: any[]
    gameId: number

    constructor () {
        super();

        this.allies = []
        this.opponents = []
        this.gameId = 0
    }

    getReportType = () => {
        let type: string[] = []

        for (let i = 0; i < reportTypes.length; i++) {
            if (window.DataStore.get(`EOG-Mass-Report_${reportTypes[i].name}`)) {
                type.push(reportTypes[i].name)
            }
        }

        return type
    }

    getPlayerList = async () => {
        let playerList = await this.get('/lol-honor-v2/v1/ballot')
        
        this.allies = playerList.eligibleAllies
        this.opponents = playerList.eligibleOpponents
        this.gameId = playerList.gameId

        console.log({
            "allyPlayers" : this.allies,
            "enermyPlayers" : this.opponents,
            "id" : this.gameId
        })
    }

    getRandomReportType = () => {
        let reportList: string[] = []

        let randomReportCount = 1 + Math.floor(Math.random() * 6);

        while (reportList.length < randomReportCount) {
            let randomReportId = Math.floor(Math.random() * this.getReportType().length);

            if (!reportList.includes(this.getReportType()[randomReportId])) {
                reportList.push(this.getReportType()[randomReportId]);
            }
        }
        return reportList;
    }

    report = async (list: any) => {
        let i = 0
        
        for (i = 0; i < list.length; i++) {
            let randomReportType: string[]

            if (window.DataStore.get("EOG-Mass-Report_reportOption") == 0) {
                randomReportType = this.getRandomReportType()
            }
            else {
                randomReportType = this.getReportType()
            }

            if (randomReportType.length > 0) {
                await this.post("/lol-player-report-sender/v1/end-of-game-reports", {
                    "categories": randomReportType,
                    "gameId": this.gameId,
                    "offenderPuuid": list[i].puuid,
                    "offenderSummonerId": list[i].summonerId,
                })

                log("Reported", list[i].summonerName, ":", JSON.stringify(randomReportType))
                
            }
        }

        window.Toast.success(`Reported ${i} players!`)
    }
}  
let massReport = new MassReport()

export { massReport }