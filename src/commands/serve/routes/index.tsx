import express from "express"
import styles from "../../../css/built.css"

const routes = express();

routes.get('/stylesheet.css', async (_, res) => {
    res.setHeader('content-type', 'text/css')
    res.send(styles)
})

export default routes
