import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect(`${process.env.DB_URL}`)
     .then(() => {
       console.log('Connected to MongoDB Successfully');
     })
     .catch(error => {
       console.error('Error connecting to MongoDB:', error)
     }
   )

}


   export{connectDB}