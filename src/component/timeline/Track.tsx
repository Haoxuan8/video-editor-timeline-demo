import React, { FC, useRef, useState } from "react";
import Clip, { IClipData } from "./Clip";
import { useDrop } from "ahooks";
import { generateId } from "../../asset/util/util";

export interface ITrackData {
    id: number,
    clips: IClipData[]
}

export interface ITackProps {
    track: ITrackData,
    timeScale: number,
    scaleWidth: number,
    selectedClipId: number,
    duration: number,
    onClipSelected: (clip: IClipData) => void,
    onTrackChange: (track: ITrackData) => void,
    onTrackClipRemove: (trackId, clipId) => void
}

const Track: FC<ITackProps> = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hovering, setHovering] = useState(false);

    useDrop(containerRef, {
        onDragEnter: () => setHovering(true),
        onDragLeave: () => setHovering(false),
        onDom: (content, e) => onDrop(content, e)
    });

    const addClip = (data, start, duration = 5000) => {
        const newClipData: IClipData = {
            id: generateId(),
            start: start,
            end: start + duration,
            data: data,
        };
        const clips = [...props.track.clips, newClipData];
        reorderClips(clips);
    };

    const getEventScale = (e) => {
        if (!containerRef.current) return 0;
        const rect = containerRef.current.getBoundingClientRect();   
        const offset = e.clientX - rect.left;
        const count = Math.ceil(offset / props.scaleWidth);
        const scale = count * props.timeScale;
        return scale;
    };

    const onDrop = (content, e) => {
        const start = getEventScale(e);
        if (content.source === "resourceManager") {
            addClip(content.data, start);
        } else if (content.source === "clip") {
            addClip(content.data, start, content.duration);
            props.onTrackClipRemove(content.trackId, content.clipId);
        }
        setHovering(false);
    };

    const resizeClip = (clip: IClipData, dragEvent: MouseEvent, isStart: boolean) => {
        const scale = getEventScale(dragEvent);
        const clipIndex = props.track.clips.findIndex((item) => item.id === clip.id);
        let prevClipEnd = 0;
        let nextClipStart = props.duration;
        if (clipIndex > 0) {
            prevClipEnd = props.track.clips[clipIndex - 1].end;
        }
        if (clipIndex < props.track.clips.length - 1) {
            nextClipStart = props.track.clips[clipIndex + 1].start;
        }
        if (isStart) {
            clip.start = Math.max(prevClipEnd, Math.min(scale, clip.end));
        } else {
            clip.end = Math.min(Math.max(scale, clip.start), nextClipStart);
        }
        props.onTrackChange({ ...props.track, clips: props.track.clips.map((c) => {
            if (c.id === clip.id) {
                return { ...clip };
            }
            return c;
        }) });

    };

    const reorderClips = (clips) => {
        clips.sort((a, b) => a.start - b.start);
        let end = 0;
        for (const clip of clips) {
            if (clip.start < end) {
                const offset = end - clip.start;
                clip.start = end;
                clip.end += offset;
            }
            end = clip.end;
        }
        props.onTrackChange({ ...props.track, clips });
    };

    return (
        <div ref={containerRef} className={`transition-all w-full flex-none
         ${hovering ? "bg-gray-300" : "bg-gray-200"} rounded-md h-9
        relative`}>        
            {
                props.track.clips.map((clip) => {
                    return (
                        <Clip
                            clip={clip}
                            trackId={props.track.id}
                            timeScale={props.timeScale}
                            scaleWidth={props.scaleWidth}
                            selectedClipId={props.selectedClipId}
                            onClipSelected={props.onClipSelected}
                            onDrag={(e, isStart) => resizeClip(clip, e, isStart)}
                        />
                    );
                })
            }
        </div>
    );
};

export default Track;