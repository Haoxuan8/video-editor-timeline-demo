import { useSize } from "ahooks";
import React, { useEffect, useState, useMemo, useRef } from "react";

const RATIO = 16 / 9;
const MAX_WIDTH = 700;

const VideoPlayer = () => {
    const containerRef = useRef(null);
    const [width, setWidth] = useState(0);
    const height = useMemo(() => {
        return width / RATIO;
    }, [width]);

    const size = useSize(containerRef);
    useEffect(() => {
        const _width = size?.width ?? 0;
        setWidth(Math.min(_width, MAX_WIDTH));
    }, [size]);

    return (
        <div ref={containerRef} className="flex-auto relative bg-gray-200">
            <div className="p-3 font-bold shadow-md bg-gray-50">
                标题
            </div>
            <div className="bg-black absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width, height }}>
                
            </div>
        </div>
    );
};

export default VideoPlayer;