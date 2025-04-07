import {createClient} from "redis"

const redis_clients = createClient()

redis_clients.on("error",(err)=>{
    console.log("Redis Client Error :: ",err)
})


export const pushToRedis = async(id:string,game_data:string)=>{
    try {
        await redis_clients.LPUSH("game_data",JSON.stringify({id,game_data}))
    } catch (error) {
        console.log("Internal Redis Server Error :: ",error)
        return
    }
}