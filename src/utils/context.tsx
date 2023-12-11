import {Context, createContext} from 'react';
import {NetworkMap} from "./NetworkInfo";

const NetworkInfoContext: Context<NetworkMap> = createContext({});

export default NetworkInfoContext;