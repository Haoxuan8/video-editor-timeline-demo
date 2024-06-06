import React, { FC, useMemo, useRef, useState } from "react";
import TestImage from "../../asset/test_image.jpg";
import { useDrag } from "ahooks";

export type DataType = "image" | "video";

export interface IData {
    id: number,
    name: string,
    type: DataType,
    src: string
}

export interface IDataItemProps {
    data: IData
}

export const testData: IData[] = [
    {
        id: 1,
        name: "测试图片测试图片测试图片测试图片.jpg",
        src: TestImage,
        type: "image"
    },
    {
        id: 2,
        name: "测试图片2.jpg",
        src: TestImage,
        type: "image"
    }
];

const DataItem: FC<IDataItemProps> = (props) => {
    const imgRef = useRef(null);
    const [dragging, setDragging] = useState(false);


    const dragData = useMemo(() => {
        return {
            data: props.data,
            source: "resourceManager",
            
        };
    }, [props.data]);

    useDrag(dragData, imgRef, {
        onDragStart: () => setDragging(true),
        onDragEnd: () => setDragging(false)
    });

    return (
        <div>
            <div
                ref={imgRef}
                className="h-20 shadow-md rounded-lg overflow-hidden bg-contain bg-no-repeat
                bg-center bg-gray-800 cursor-pointer"
                style={{ backgroundImage: `url(${props.data.src})` }}
            >
            </div>
            <div className="whitespace-nowrap overflow-hidden text-ellipsis
                 mt-2 text-sm text-gray-300">
                {props.data.name}
            </div>
        </div>
    );
};

export default DataItem;