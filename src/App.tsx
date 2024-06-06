import React from "react";
import ResourceManager from "./component/resource_manager/ResourceManager";
import VideoPlayer from "./component/video_player/VideoPlayer";
import Timeline from "./component/timeline/Timeline";

const App = () => {
    return (
        <div className="w-full h-full flex">
            <ResourceManager />
            <div className="flex-auto flex flex-col overflow-hidden">
                <VideoPlayer />
                <Timeline />
            </div>
        </div>
    );
};

export default App;