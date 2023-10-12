import express, {
  Application,
  json,
  Request,
  Response,
  urlencoded,
} from 'express';

import compression from 'compression';
import cors from 'cors';
import RoutesV1 from './api/routes/v1';
import { environment, port as EnvPort } from './config';
import { NotFoundError } from './core/ApiError';
import cookieParser from 'cookie-parser';
import ErrorHandler from './api/middleware/v1/errorHandler';
import { checkuserIp, overalMonthlylLimiter } from './api/middleware/v1/rate-limiter';

process.on('uncaughtException', (e) => {
  console.log('uncaught error', e.message);
});

process.on('unhandledRejection', (e:any) => {
  console.log('unhandled error', e);
});

const app: Application = express();
export const port = process.env.PORT || EnvPort;

app.set('port', port);

app.use(compression());
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

app.use(cors());

app.use(urlencoded({ limit: '10mb', extended: false, parameterLimit: 10000 }));

app.use(json({ limit: '10mb' }));



app.use(checkuserIp);
app.use(overalMonthlylLimiter)


app.get('/notifications', (req: Request, res: Response) => {
  return res.status(200).json({
    environment,
    message: `Welcome to Notifications Service Backend Server`,
  });
});


app.use('/v1', RoutesV1);

app.use((req, res, next) => {
  next(new NotFoundError())
});

app.use(ErrorHandler);

export default app;
