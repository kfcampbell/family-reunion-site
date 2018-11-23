import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from './routes/routes';

class App {

    public app: express.Application;
    public routePrev: Routes = new Routes();

    constructor() {
        this.app = express();
        this.config();
        this.routePrev.routes(this.app);
    }

    private config(): void {
        // support application/json type post data
        this.app.use(bodyParser.json());

        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

}

// tslint:disable-next-line:no-default-export
export default new App().app;