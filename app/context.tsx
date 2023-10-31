
import {Context, createContext} from 'react';
import {TrackerNetwork} from "@/app/ImgInfo";

const ImgInfoContext: Context<TrackerNetwork[]> = createContext([{"name":"", "address":"", "type":"", "imageBase64":""}]);

export default ImgInfoContext;