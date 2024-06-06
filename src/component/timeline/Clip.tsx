import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { IData } from "../resource_manager/DataItem";
import { useDrag, useEventListener, useHover } from "ahooks";

export interface IClipData {
    id: number,
    start: number,
    end: number,
    data: IData
}

export interface IClipProps {
    clip: IClipData,
    timeScale: number,
    scaleWidth: number,
    selectedClipId: number,
    onClipSelected: (clip: IClipData) => void,
    onDrag: (e: MouseEvent, isStart: boolean) => void,
    trackId: number
}

const Handler = (props) => {
    const [dragging, setDragging] = useState(false);
    useEventListener("mouseup", () => setDragging(false));
    const onMouseMove = (e) => {
        if (!dragging) return;
        props.onDrag(e);
    };
    useEventListener("mousemove", onMouseMove);

    return (
        <div
            onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragging(true);
            }}
            onMouseMove={onMouseMove}
            className={`${props.className} cursor-col-resize top-1/2 -translate-y-1/2`}
        >
            <div className="flex items-center justify-center h-3 w-[6px] bg-blue-500">
                <div className="h-[6px] w-[2px] bg-white rounded-sm"></div>
            </div>
        </div>
    );
};

const Clip: FC<IClipProps> = (props) => {
    const containerRef = useRef(null);
    const [scaleContentCount, scaleLeftCount] = useMemo(() => {
        return [
            Math.ceil((props.clip.end - props.clip.start) / props.timeScale),
            Math.ceil(props.clip.start / props.timeScale)
        ];
    }, [props.clip, props.timeScale]);

    const hovering = useHover(containerRef);
    const [dragging, setDragging] = useState(false);
    const isSelected = props.selectedClipId === props.clip.id;

    useDrag({
        trackId: props.trackId,
        source: "clip",
        clipId: props.clip.id,
        duration: props.clip.end - props.clip.start,
        data: props.clip.data
    }, containerRef, {
        onDragStart: () => setDragging(true),
        onDragEnd: () => setDragging(false),
    });

    return (
        <div
            ref={containerRef}
            className="px-1 absolute h-full rounded-md bg-contain"
            style={{
                left: `${scaleLeftCount * props.scaleWidth}px`,
                width: `${scaleContentCount * props.scaleWidth}px`,
                backgroundImage: `url(${props.clip.data.src})`,
            }}
            onClick={() => props.onClipSelected(props.clip)}
        >
            <div
                className={`text-gray-100 text-xs text-ellipsis 
                whitespace-nowrap overflow-hidden ${hovering ? "opacity-100" : "opacity-0"} transition-all select-none`}>
                <span className="bg-gray-800 bg-opacity-60 px-1 rounded-sm">{props.clip.data.name}</span>
            </div>
            {
                isSelected && (
                    <div className="absolute inset-0 border-blue-500 border-2 rounded-md">
                        <Handler onDrag={(e) => props.onDrag(e, true)} className="absolute left-0" />
                        <Handler onDrag={(e) => props.onDrag(e, false)} className="absolute right-0" />
                    </div>
                )
            }
        </div>
    );
};

export default Clip;