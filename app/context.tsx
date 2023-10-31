
import {Context, createContext} from 'react';
import {NetworkMap} from "@/app/NetworkInfo";

const NetworkInfoContext: Context<NetworkMap> = createContext({});

export default NetworkInfoContext;