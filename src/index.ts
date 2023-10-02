import { app } from './settings'
import {RunDb} from "./data/DB";


const port = process.env.PORT || 3005


export const  startApp = async ()=>{
    await RunDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
startApp()

