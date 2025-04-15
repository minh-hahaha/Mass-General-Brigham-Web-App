import DrawNodes from "@/components/DrawNodes.tsx";


const MapEditorPage = () => {
    return (
        <>
            <div>
                <DrawNodes svgMapUrl={"/20PPFloor2.svg"} buildingId={"2"} currentFloor={"2"}/>
            </div>
        </>
    )
}

export default MapEditorPage;