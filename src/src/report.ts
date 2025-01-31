import { log } from "./log.ts"

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
    reportType: string[]
    allies: any[]
    opponents: any[]
    gameId: number

    constructor () {
        super();

        this.reportType = [
            "NEGATIVE_ATTITUDE",
            "VERBAL_ABUSE",
            "LEAVING_AFK",
            "ASSISTING_ENEMY_TEAM",
            "HATE_SPEECH",
            "THIRD_PARTY_TOOLS",
            "INAPPROPRIATE_NAME"
        ]

        this.allies = []
        this.opponents = []
        this.gameId = 0
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

        for (let i = 0; i < 1 + Math.floor(Math.random() * 6); i++) {
            reportList.push(this.reportType[Math.floor(Math.random() * 7)])
        }

        return reportList
    }

    report = async (list) => {
        let i = 0
        for (i = 0; i < list.length; i++) {
            let randomReportType = this.getRandomReportType()
            await this.post("/lol-player-report-sender/v1/end-of-game-reports", {
                "categories": randomReportType,
                "gameId": this.gameId,
                "offenderPuuid": list[i].puuid,
                "offenderSummonerId": list[i].summonerId,
            })

            log("Reported", list[i].summonerName, ":", JSON.stringify(randomReportType))
        }
        window.Toast.success(`Reported ${i} players!`)
    }
}  
let massReport = new MassReport()

export { massReport }