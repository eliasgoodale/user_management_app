import { store } from '../index'

export interface ICommand {
    execute:(dispatchFn: any) => void;
    unexecute:() => void;
}

// abstract class BaseCommand implements ICommand {
//     private _type: string;
//     public payload: any;

//     abstract execute(): void;
//     abstract unexecute(): void;
// }

class ReversableCommand {
    private _type: string;
    public payload: any;
    public invoker: any;
    public receiver: any;
    
    constructor({type, payload, invoker, receiver}: any) {
        this._type = type;
        this.payload = payload;
        this.invoker = invoker;
        this.receiver = receiver;
    }
    execute(): void {
        this.invoker({
            type: this._type, 
            payload: this.payload
        })
    }
}