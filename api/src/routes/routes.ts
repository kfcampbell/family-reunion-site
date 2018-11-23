import { Request, Response } from "express";
import { Post } from '../models/post';
import { DBHelper } from '../utils/db';
import { cosmosDbConfig } from '../../dbconfig';

export class Routes {
    private async testMethod() {
        const helper = new DBHelper(cosmosDbConfig.host, cosmosDbConfig.authKey);
        const doc = await helper.addItem({
            "coat": "i pull up in my coat",
            "came": "up still want to kill myself"
        });

        doc.came = 'whatever, dude';

        await helper.updateItem(doc);

        const otherdoc = await helper.getItem(doc.id);
        if (doc.id === otherdoc.id) {
            console.log('ids match!');
        } else {
            console.log('ids don\'t match!');
        }

        let allposts = await helper.getAllPosts();

        const wasDeleted = await helper.deleteItem(doc.id);

        allposts = await helper.getAllPosts();

        console.log('test completed');
    }

    public routes(app: any): void {
        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'Well...is this exercise working?'
                });
            });

        app.route('/post')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'Generic post GET.'
                });
            })
            .post((req: Request, res: Response) => {
                // do documentdb operation here
                this.testMethod()
                    .then(() => {
                        console.log('it worked');
                    })
                    .catch(() => {
                        console.log('something messed up');
                    });
            });

        app.route('/post/:postId')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: `Get post by Id! (which is: ${req.params.postId})`
                });
            })
            .put((req: Request, res: Response) => {
                // todo: model verification
                const model = req.body as Post;
                console.log(JSON.stringify(model));
                res.status(200).send({
                    message: 'putting a post'
                });
            })
            .delete((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'deleting a post'
                });
            });
    }
}