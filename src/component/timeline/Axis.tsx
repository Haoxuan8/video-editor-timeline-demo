import React, { FC, useMemo } from "react";

export interface IAxisProps {
    timeScale: number,
    scaleWidth: number,
    width: number
}

const formatTime = (duration) => {
    const s = Math.floor(duration / 1000);
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    const ms = Math.floor((duration % 1000) / 10);

    const padLeft = (n) => {
        return `${n < 10 ? "0" : ""}${n}`;
    };
    return `${padLeft(minutes)}:${padLeft(seconds)}:${padLeft(ms)}`;
};

const AxisItem = (props) => {
    const [isTen, isFive] = useMemo(() => {
        const _isTen = props.index % 10 === 0;
        return [_isTen, props.index % 5 === 0 && !_isTen];
    }, [props.index]);

    return (
        <div style={{ left: props.index * props.scaleWidth }}
            className="absolute text-xs">
            <div
                className="absolute w-[1px] h-2 bg-gray-400"
                style={{
                    height: isTen ? "8px" : isFive ? "6px" : "4px"
                }}
            />
            <div className="absolute -translate-x-1/2 translate-y-[6px] text-gray-400">
                {(isTen && props.index > 0) ? `${formatTime(props.index * props.timeScale)}` : ""}
            </div>
        </div>
    );
};

const Axis: FC<IAxisProps> = (props) => {
    const scaleCountArray = useMemo(() => {
        const count = Math.floor(props.width / props.scaleWidth);
        return Array(count).fill(0);
    }, [props.width, props.scaleWidth]);

    return (
        <div className="h-6 sticky top-0">
            {
                scaleCountArray.map((_, index) => {
                    return (
                        <AxisItem
                            timeScale={props.timeScale}
                            scaleWidth={props.scaleWidth}
                            index={index}
                            key={index}
                        />
                    );
                })
            }
        </div>
    );
};

export default Axis;