import React from "react";
import MinusSvg from "../../asset/minus.svg";
import PlusSvg from "../../asset/plus.svg";

const Button = (props) => {
    return (
        <button className="flex-none h-8 w-8 rounded-xl flex items-center justify-center
            text-xl hover:bg-gray-200 transition-all"
        onClick={props.onClick}
        >
            {props.children}
        </button>
    );
};

const Toolbar = (props) => {
    return (
        <div className="flex-none h-12 flex items-center px-2 border-b border-gray-200">
            <div className="flex-auto"></div>
            <Button>
                <MinusSvg></MinusSvg>
            </Button>
            <div className="w-2"></div>
            <Button>
                <PlusSvg></PlusSvg>
            </Button>
        </div>
    );
};

export default Toolbar;