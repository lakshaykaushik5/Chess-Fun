import {createClient} from "redis"
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()
const redis_worker_client = createClient()

redis_worker_client.on("error",(err)=>{
    console.log("redis worker client :: ",err)
})

const redis_worker = async()=>{
    try {
        await redis_worker_client.connect()
        console.log("Redis Worker Connected")

        while(true){
            const data = await redis_worker_client.BRPOP("game_data",0)
            if(data){
                await push_to_db(data?.element)
            }
        }
    } catch (error) {
        console.log("Internal Redis Worker Client Error :: ",error)
    }
}

const push_to_db = async(data:string) =>{
    try {
        const {id,game_data} = JSON.parse(data)
        // const json_game_data = 
        const game = await prisma.masterMoves.create({
            data:{
                gameId:id,
                fenString:game_data
            }
        })
    } catch (error) {
        console.log("DB Error :: ",error)
    }
}