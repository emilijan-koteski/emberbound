// Boot. The only file that knows every layer; later stories add the renderer, the app and
// the frame loop here.
import { log } from './core/log.ts';

log.setLevel(import.meta.env.DEV ? 'debug' : 'warn');
log.info('app', 'Boot');
