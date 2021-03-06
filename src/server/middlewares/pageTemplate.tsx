import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { SheetsRegistry } from 'react-jss';
import { StaticRouter } from 'react-router';
import Chain from '../../app/chain';
import * as csso from 'csso';
import * as Express from 'express';

export default (req: Express.Request, res: Express.Response) => {
	const route = {};
	const sheets = new SheetsRegistry();

	const components = (
		<StaticRouter location={req.url} context={route}>
			<Chain />
		</StaticRouter>
	);

	const html = renderToString(components);
	const css = csso.minify(sheets.toString()).css;

	res.send(`<!DOCTYPE html>
		<html lang="ru">
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<title>${res.locals.title || 'Frontend Boilerplate'}</title>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css" />
			<style type="text/css" id="server-side-styles">${css}</style>
			<link href="/global.css" type="text/css" />
		</head>
		<body>
			<div data-render="ssr" id="main">${html}</div>
			<script defer src="/dist${res.locals.script.vendor}"></script>
			<script defer src="/dist${res.locals.script.client}"></script>
			${
				(res.locals.script.chunks || []).map(
					(script: string) => `<script defer src="/dist${script}"></script>`
				).join('')
			}
		</body>
		</html>
	`);
}