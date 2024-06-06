import React, { useEffect, useMemo, useRef, useState } from "react";
import Toolbar from "./Toolbar";
import Axis from "./axis";
import { useDrop, useSize } from "ahooks";
import Track, { ITrackData } from "./Track";
import { IClipData } from "./Clip";
import { generateId } from "../../asset/util/util";

const defalutTracks: ITrackData[] = [{
    id: 1,
    clips: []
}];

const DropArea = (props) => {
    const ref = useRef(null);
    const [hovering, setHovering] = useState(false);
    useDrop(ref, {
        onDragEnter: () => setHovering(true),
        onDragLeave: () => setHovering(false),
        onDom: (content, e) => {
            setHovering(false);
            props.onDrop(content, e);
        }
    });
    return (
        <div ref={ref} className={`${props.className} flex-none ${hovering ? "border-b border-blue-400" : ""}`}>
        </div>
    );
};

const Timeline = () => {
    const containerRef = useRef(null);
    const tracksContainerRef = useRef<HTMLDivElement>(null);
    const [tracks, setTracks] = useState(defalutTracks);
    const [timeScale, setTimeScale] = useState(500); // 一个刻度1000ms
    const [scaleWidth, setScaleWidth] = useState(14); // 一个刻度多宽
    const [duration, setDuration] = useState(120000); // 持续时间
    const [selectedClipId, setSelectedClipId] = useState(null);

    const containerSize = useSize(containerRef);
    const minWidth = containerSize?.width ?? 0;

    const width = useMemo(() => {
        const count = Math.ceil(duration / timeScale);
        return Math.max(count * scaleWidth, minWidth);
    }, [minWidth, duration, timeScale, scaleWidth]);

    useEffect(() => {
    }, [tracks]);

    const onTrackChange = (track: ITrackData) => {
        setTracks((prev) => prev.map((t) => {
            return track.id === t.id ? track : t;
        }));
    };

    const onClipSelected = (clip: IClipData) => {
        setSelectedClipId(clip.id);
    };

    const getEventScale = (e, dragOffset = 0) => {
        if (!tracksContainerRef.current) return 0;
        const rect = tracksContainerRef.current.getBoundingClientRect();   
        const offset = e.clientX - dragOffset - rect.left;
        const count = Math.ceil(offset / scaleWidth);
        const scale = count * timeScale;
        return scale;
    };

    const onDrop = (content, event, index) => {
        const dragOffset = content.dragOffsetRef?.current ?? 0;
        const start = getEventScale(event, dragOffset);
        const newClipData = {
            id: generateId(),
            start: start,
            end: start + (content.duration ?? 5000),
            data: content.data,
        };
        const track = {
            id: generateId(),
            clips: [newClipData]
        };
        setTracks((prev) => {
            const temp = [...prev];
            temp.splice(index, 0, track);
            if (content.source === "clip") {
                const tIndex = temp.findIndex((i) => i.id === content.trackId);
                temp[tIndex].clips = temp[tIndex].clips.filter((c) => c.id !== content.clipId);
                if (temp[tIndex].clips.length === 0) {
                    temp.splice(tIndex, 1);
                }
            }
            return temp;
        });
    };

    const onTrackClipRemove = (trackId, clipId) => {
        setTracks((prev) => {
            const temp = [...prev];
            const tIndex = temp.findIndex((i) => i.id === trackId);
            temp[tIndex].clips = temp[tIndex].clips.filter((c) => c.id !== clipId);
            if (temp[tIndex].clips.length === 0) {
                temp.splice(tIndex, 1);
            }
            return temp;
        });
    }; 

    return (
        <div ref={containerRef} className="h-[232px] flex flex-col shadow-md bg-gray-50">
            <Toolbar />
            <div className="flex-auto overflow-scroll relative">
                <div className="min-h-full flex flex-col px-2" style={{ width: width }}>
                    <Axis
                        timeScale={timeScale}
                        scaleWidth={scaleWidth} 
                        width={width}
                    />
                    <div ref={tracksContainerRef} className="flex flex-col flex-auto overflow-y-visible justify-end pb-6 pt-3">
                        <DropArea onDrop={(c, e) => onDrop(c, e, 0)} className="h-12 mb-1" />
                        {
                            tracks.map((track, index) => {
                                return (
                                    <React.Fragment>
                                        <Track
                                            track={track}
                                            timeScale={timeScale}
                                            scaleWidth={scaleWidth}
                                            selectedClipId={selectedClipId}
                                            onTrackChange={onTrackChange}
                                            onClipSelected={onClipSelected}
                                            duration={duration}
                                            onTrackClipRemove={onTrackClipRemove}
                                        />
                                        <DropArea onDrop={(c, e) => onDrop(c, e, index + 1)} className="h-1" />
                                    </React.Fragment>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timeline;