import { app } from './settings'
import {RunDb} from "./data/DB";

//const app = initApp()
const port = process.env.PORT || 3005


export const  startApp = async ()=>{
    app.set('trust proxy', true)
    await RunDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
startApp()

