/*     
 Simple ErrorManager so the debouncer can be run.
*/

class ErrorManager {
  create({ name, message }: { name: string; message: string }): void {
    throw new Error(`${name}: ${message}`);
  }
}

export default ErrorManager;
