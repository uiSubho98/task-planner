import bootstrap from "./src/db";
import dotenv from "dotenv";
import { app } from "./app";

dotenv.config({
  path: "./env",
});
bootstrap()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(
        `\n MongoDB connected !! DB HOST`
      );
    });
    app.on("error", (error) => {
      console.log("Server error", error);
      throw error;
    });
  })
  .catch((err) => {
    console.log("MONGO DB CONNECTION FAILED !!!", err);
  });
