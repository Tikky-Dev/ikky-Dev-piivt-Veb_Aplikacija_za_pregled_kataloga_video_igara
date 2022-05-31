import * as express from "express";
import * as cors from "cors";
import IConfig from './config/IConfig.interface';
import { DevConfig } from "./config/config";

const app: express.Application = express();

const config: IConfig = DevConfig;

app.use(cors());
app.use(express.json());
app.use(config.server.static.route, express.static(config.server.static.path, {
    index: config.server.static.index,
    dotfiles: config.server.static.dotfiles,
    cacheControl: config.server.static.casheControl,
    etag: config.server.static.etag,
}));

app.get('/about', (req, res) => {
    res.send("<h1>Tekst o nama</h1>");
});

// Default response
app.use((req, res) => {
    res.sendStatus(404);
});

app.listen(config.server.port);