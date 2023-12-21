import connectDb from "./db/index.js";


connectDb()
























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