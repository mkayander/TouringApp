import {useState} from "react";

export enum EditTool {
    Draw,
    Delete,
    Insert
}

export const useEditTools = () => {
    const [activeTool, setActiveTool] = useState<EditTool | null>(null);

    const toggleTool = (tool: EditTool) => {
        if (activeTool === tool) {
            setActiveTool(null);
        } else {
            setActiveTool(EditTool.Draw);
        }
    };

    return {activeTool, setActiveTool, toggleTool};
};

export type EditToolsHook = ReturnType<typeof useEditTools>;
