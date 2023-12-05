import {InitApp} from './settings'
import {RunDb} from "./data/DB";

const port = process.env.PORT || 3005

const app = InitApp()
export const  startApp = async ()=>{
    app.set('trust proxy', true)
    await RunDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
startApp()

