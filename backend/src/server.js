import app from './app.js';
import { config } from './config/env.js';

app.listen(config.port, () => {
  console.log(`Backend running on http://localhost:${config.port}`);
});
