import {Elysia} from 'elysia';
import {html} from '@elysiajs/html';
import {staticPlugin} from '@elysiajs/static';
import dogGroup from './dog-router';

const app = new Elysia();

// This serves static files from the public directory.
app.use(staticPlugin({prefix: 'public'}));

// This enables returning JSX to create HTML responses.
app.use(html());

app.get('/', ({set}) => (set.redirect = '/dogs'));

// @ts-ignore I don't understand why this is necessary.
app.group('/dogs', dogGroup);

app.listen(3000);
console.log(`listening on port ${app.server?.port}`);
