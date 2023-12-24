import 'dotenv/config'
import connectDb from "./db/index.js"
import {app} from "./app.js"



connectDb()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(` server at running on port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
























/*
const app = express()

    (async () => {

        try {

            await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
            app.on("error ", (error) => {
                console.log("ERROR ", error);
                throw error
            })

            app.listen(process.env.PORT, () => {
                console.log(`App is listen on port ${process.env.PORT}`);
            })

        } catch (error) {
            console.log("ERROR: ", error);
            throw error
        }

    })()
    */