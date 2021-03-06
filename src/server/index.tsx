import * as morgan from 'morgan';
import * as Express from 'express';
import chalk from 'chalk';

import pageTemplate from './middlewares/pageTemplate';
import pageNotFound from './middlewares/404';
import staticUrls from './middlewares/staticUrls';

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';
const app = Express();
chalk.enabled = true;
chalk.level = 3;

const errorRequestHandler: Express.ErrorRequestHandler = (err, _req, _res, _next) => {
	console.error(err);
}

app.use('/dist', Express.static('dist/public'));
app.use('/', Express.static('static'));
app.all('*', staticUrls);
app.all('/', pageTemplate);
app.all('*', morgan('common'));
app.all('*', errorRequestHandler);
app.all('*', pageNotFound);

process.on('unhandledRejection', (reason, promise) => {
	console.error("Unhandled rejection at:\n", promise, "\n\nReason: ", reason);
});


app.listen(+PORT, HOST, () => {
	console.log(`${chalk.bgGreen.white.bold('      ')}\n${chalk.bgGreen.white.bold(' DONE ')} Server @ http://${HOST}:${PORT}\n${chalk.bgGreen.white.bold('      ')}\n`);
})