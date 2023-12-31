import moment from "moment/moment";
import {NetworkMap} from "./NetworkInfo";

export const GV = {
    SOURCE_NETWORK: 'Source Network',
    STATUS: 'Status'
}

export function getElapsedTime(uTime: string) {
    const M = 60
    const H = M * 60
    const D = H * 24
    const W = D * 7

    const createMoment = moment(uTime)
    const currentMoment = moment()
    const createTime = createMoment.format('X')
    const currentTime = currentMoment.format('X')
    const diffValue = parseInt(currentTime) - parseInt(createTime)
    const diff = Math.abs(diffValue)
    const later = diffValue < 0

    if (diff === 0) {
        return 'right now'
    }
    else if (diff > 0 && diff < M) {
        return makeFromNowText(diff, 'second', undefined, '', later)
    }
    else if (diff >= M && diff < H) {
        const minute = Math.floor(diff / M)
        const second = diff % M
        return makeFromNowText(minute, 'minute', second, 'second', later)
    }
    else if (diff >= H && diff < D) {
        const hour = Math.floor(diff / H)
        const minute = Math.floor((diff % H) / M)
        return makeFromNowText(hour, 'hour', minute, 'minute', later)
    }
    else if (diff >= D && diff < W) {
        const day = Math.floor(diff / D)
        const hour = Math.floor((diff % D) / H)
        return makeFromNowText(day, 'day', hour, 'hour', later)
    }
    else {
        const week = Math.floor(diff / W)
        const day = Math.floor((diff % W) / D)
        return makeFromNowText(week, 'week', day, 'day', later)
    }
}

export function makeFromNowText(fistTime: number, firstText: string, secondTime: number | undefined, secondText: string, later: boolean) {
    const _secondTime = secondTime === 0 ? undefined : secondTime
    const result = [
        fistTime && `${fistTime} ${firstText}${fistTime === 1 ? "" : "s"}`,
        _secondTime && `${_secondTime} ${secondText}${_secondTime === 1 ? "" : "s"}`,
    ]

    if (later) {
        result.unshift('in')
    }
    else {
        result.push('ago')
    }

    return result.join(" ")
}

interface Filters {
    [key: string]:string
}
export const COL: Filters = {
    SRC: 'src',
    STATUS: 'Status'
}

export function getNetworkName(nMap: NetworkMap, address: string) {
    if(Object.keys(nMap).length === 0 || !address) {
        return '';
    }
    return nMap[address]?.name + ' (' + address + ')';
}

export function getNetworkIcon(nMap: NetworkMap, address: string){
    if(Object.keys(nMap).length === 0 || !address) {
        return '';
    }
    return nMap[address].imageBase64;
}
