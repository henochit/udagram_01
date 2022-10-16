import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  app.get("/filteredimage", async (req, res) => {
    const image_url: string = (
      req.query.image_url ? req.query.image_url : ""
    ).toString();

    if (!image_url) return res.status(404).send(`Image url not specified`);

    try {
      let filterResult = await filterImageFromURL(image_url);

      res.sendFile(filterResult, null, (err) => {
        if (!err) {
          deleteLocalFiles([filterResult]);
        } else {
          console.log(err);
        }
      });
    } catch (error) {
      console.log(error);
    }

    return;
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
